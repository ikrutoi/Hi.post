import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import {
  CalendarCardItem,
  Card,
  CardCalendarIndex,
} from '../../domain/types'
import { selectIsAromaComplete } from '@aroma/infrastructure/selectors'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import {
  selectCardphotoIsComplete,
  selectCardphotoPreview,
} from '@cardphoto/infrastructure/selectors'
import {
  selectIsDateComplete,
  selectMergedDispatchDates,
} from '@date/infrastructure/selectors'
import { DispatchDate } from '@entities/date'
import { CardSection } from '@shared/config/constants'
import { selectCartItems } from '@cart/infrastructure/selectors'
import type { PostcardHydrated } from '@entities/postcard'
import { cardListPreviewUrlFromCard } from '@entities/card/domain/helpers'

export const selectCardState = (state: RootState) => state.card

export const selectAllCards = (state: RootState) => selectCardState(state).cards

/** Первое непустое превью среди синхронизированных рабочих карт (список дат, fallback). */
export const selectFirstProcessedCardThumbnailUrl = createSelector(
  [selectAllCards],
  (cards: Card[]) => {
    for (const c of cards) {
      if (c.isProcessed && c.thumbnailUrl) return c.thumbnailUrl
    }
    return null
  },
)

export const selectCalendarIndex = (state: RootState) =>
  selectCardState(state).calendarIndex

export const selectCalendarPreviewCache = (state: RootState) =>
  selectCardState(state).calendarPreviewCache

/** URL превью из кэша по `cardId` (стабильный селектор для `useAppSelector`). */
export const selectCalendarPreviewDisplayUrlByCardId = createSelector(
  [
    selectCalendarPreviewCache,
    (_state: RootState, cardId: string) => cardId,
  ],
  (cache, cardId) => (cardId ? (cache[cardId] ?? null) : null),
)

export const selectCardById = (id: string) => (state: RootState) =>
  state.card.cards.find((c) => c.id === id)

export const selectPreviewCard = createSelector(
  [selectAllCards, (state: RootState) => state.card.previewCardId],
  (cards: Card[], previewId) => {
    if (!previewId) return null
    return cards.find((c) => c.id === previewId) ?? null
  },
)

const sameDispatchDateKey = (a: DispatchDate, b: DispatchDate) =>
  a.year === b.year && a.month === b.month && a.day === b.day

function postcardToCalendarItem(
  p: PostcardHydrated,
  /** Стабильный уникальный индекс слота в проходе (дубликаты в Redux cart / повторы id открытки). */
  listSlotIndex: number,
): CalendarCardItem {
  const c = p.card
  const previewUrl = cardListPreviewUrlFromCard(c) ?? ''
  return {
    cardId: c.id,
    rowKey: `postcard:${listSlotIndex}:${p.id}:${p.status}`,
    /** Дата отправки открытки (`p.date`), как в корзине и списке — не `card.date`. */
    date: p.date,
    previewUrl,
    status: p.status,
    isProcessed:
      Boolean(c.isProcessed) ||
      Boolean(c.cardphoto?.appliedData ?? c.cardphoto?.assetData) ||
      previewUrl.startsWith('blob:'),
  }
}

export const selectCardsByDateMap = createSelector(
  [
    selectAllCards,
    selectCartItems,
    selectCardphotoPreview,
    selectMergedDispatchDates,
    (state: RootState) => state.sectionEditorMenu.activeSection,
  ],
  (
    allCards: Card[],
    cartItems: PostcardHydrated[],
    photoPreview,
    activeDates,
    editorMenuActiveSection,
  ) => {
    const map: Record<string, CardCalendarIndex> = {}
    const showOnlyPersistedPostcards = editorMenuActiveSection === 'history'

    const isActiveEditorDate = (d: DispatchDate) =>
      activeDates.some((a) => sameDispatchDateKey(a, d))

    const getEntry = (date: DispatchDate) => {
      const key = `${date.year}-${date.month}-${date.day}`
      if (!map[key]) {
        map[key] = {
          processed: null,
          cart: [],
          ready: [],
          sent: [],
          delivered: [],
          error: [],
        }
      }
      return map[key]
    }

    let postcardListSlot = 0
    for (const p of cartItems) {
      if (p.status === 'processed') continue
      const item = postcardToCalendarItem(p, postcardListSlot)
      postcardListSlot += 1
      const entry = getEntry(item.date)
      switch (p.status) {
        case 'cart':
        case 'cartBlocked':
          entry.cart.push(item)
          break
        case 'ready':
          entry.ready.push(item)
          break
        case 'sent':
          entry.sent.push(item)
          break
        case 'delivered':
          entry.delivered.push(item)
          break
        case 'error':
          entry.error.push(item)
          break
      }
    }

    if (!showOnlyPersistedPostcards) {
      for (const card of allCards) {
        if (!card.isProcessed) continue
        if (!isActiveEditorDate(card.date)) continue
        const entry = getEntry(card.date)
        entry.processed = {
          cardId: card.id,
          rowKey: `editor-card:${card.id}`,
          date: card.date,
          previewUrl: cardListPreviewUrlFromCard(card) ?? '',
          status: 'cart',
          isProcessed: true,
        }
      }

      if (photoPreview?.previewUrl) {
        for (const activeDate of activeDates) {
          const entry = getEntry(activeDate)
          const dk = `${activeDate.year}-${activeDate.month}-${activeDate.day}`
          entry.processed = {
            cardId: 'current_session',
            rowKey: `live-session:${dk}`,
            date: activeDate,
            previewUrl: photoPreview.previewUrl,
            status: 'cart',
            isProcessed: true,
          }
        }
      }

      for (const activeDate of activeDates) {
        getEntry(activeDate)
      }
    }

    return map
  },
)

export const selectIsCardReady = createSelector(
  [
    selectCardphotoIsComplete,
    selectCardtextIsComplete,
    selectIsEnvelopeReady,
    selectIsAromaComplete,
    selectIsDateComplete,
  ],
  (photo, text, envelope, aroma, date) => {
    return photo && text && envelope && aroma && date
  },
)

export const selectIsProcessedReady = (state: RootState) => state.card.isReady

export const selectActiveSection = (state: RootState) =>
  state.card.activeSection

export const selectIsSectionActive = (section: CardSection) =>
  createSelector(
    [selectActiveSection],
    (activeSection) => activeSection === section,
  )
