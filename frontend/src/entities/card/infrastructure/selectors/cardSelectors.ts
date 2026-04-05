import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import { CalendarCardItem, CardCalendarIndex } from '../../domain/types'
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

export const selectCardState = (state: RootState) => state.card

export const selectAllCards = (state: RootState) => selectCardState(state).cards

/** Первое непустое превью среди синхронизированных processed-карточек (список дат, fallback). */
export const selectFirstProcessedCardThumbnailUrl = createSelector(
  [selectAllCards],
  (cards) => {
    for (const c of cards) {
      if (c.status === 'processed' && c.thumbnailUrl) return c.thumbnailUrl
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
  state.card.cards.find((card) => card.id === id)

export const selectPreviewCard = createSelector(
  [selectAllCards, (state: RootState) => state.card.previewCardId],
  (cards, previewId) => cards.find((c) => c.id === previewId) || null,
)

export const selectCardsByDateMap = createSelector(
  [
    selectCalendarIndex,
    selectAllCards,
    selectCardphotoPreview,
    selectMergedDispatchDates,
  ],
  (index, allCards, photoPreview, activeDates) => {
    const map: Record<string, CardCalendarIndex> = {}

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

    Object.keys(index).forEach((k) => {
      const key = k as keyof CardCalendarIndex
      if (key === 'processed') return
      const data = index[key]
      if (!data) return

      if (Array.isArray(data)) {
        data.forEach((item) => {
          const entry = getEntry(item.date)
          ;(entry[key] as CalendarCardItem[]).push(item)
        })
      }
    })

    for (const card of allCards) {
      if (card.status !== 'processed') continue
      const entry = getEntry(card.date)
      entry.processed = {
        cardId: card.id,
        date: card.date,
        previewUrl: card.thumbnailUrl,
        status: card.status,
      }
    }

    if (photoPreview?.previewUrl) {
      for (const activeDate of activeDates) {
        const entry = getEntry(activeDate)
        entry.processed = {
          cardId: 'current_session',
          date: activeDate,
          previewUrl: photoPreview.previewUrl,
          status: 'processed',
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
