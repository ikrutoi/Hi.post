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
import type { Postcard } from '@entities/postcard'

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

/** URL для отображения превью в ячейке: из кэша (мгновенно) или fallback на исходный previewUrl. */
export const selectCalendarPreviewDisplayUrl = (cardId: string) =>
  createSelector(
    [selectCalendarPreviewCache, () => cardId],
    (cache, id) => cache[id] ?? null,
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
  p: Postcard,
  /** Стабильный уникальный индекс слота в проходе (дубликаты в Redux cart / повторы localId). */
  listSlotIndex: number,
): CalendarCardItem {
  const c = p.card
  return {
    cardId: c.id,
    rowKey: `postcard:${listSlotIndex}:${p.localId}:${p.status}`,
    date: c.date,
    previewUrl: c.thumbnailUrl,
    status: p.status,
    isProcessed: false,
  }
}

export const selectCardsByDateMap = createSelector(
  [
    selectAllCards,
    selectCartItems,
    selectCardphotoPreview,
    selectMergedDispatchDates,
  ],
  (allCards: Card[], cartItems: Postcard[], photoPreview, activeDates) => {
    const map: Record<string, CardCalendarIndex> = {}

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
      if (p.status === 'favorite' || p.status === 'processed') continue
      const item = postcardToCalendarItem(p, postcardListSlot)
      postcardListSlot += 1
      const entry = getEntry(item.date)
      switch (p.status) {
        case 'cart':
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

    for (const card of allCards) {
      if (!card.isProcessed) continue
      if (!isActiveEditorDate(card.date)) continue
      const entry = getEntry(card.date)
      entry.processed = {
        cardId: card.id,
        rowKey: `editor-card:${card.id}`,
        date: card.date,
        previewUrl: card.thumbnailUrl,
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
