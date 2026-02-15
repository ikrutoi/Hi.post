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
  selectSelectedDate,
} from '@date/infrastructure/selectors'
import { DispatchDate } from '@entities/date'
import { CardSection } from '@shared/config/constants'

export const selectCardState = (state: RootState) => state.card

export const selectAllCards = (state: RootState) => selectCardState(state).cards

export const selectCalendarIndex = (state: RootState) =>
  selectCardState(state).calendarIndex

export const selectCardById = (id: string) => (state: RootState) =>
  state.card.cards.find((card) => card.id === id)

export const selectPreviewCard = createSelector(
  [selectAllCards, (state: RootState) => state.card.previewCardId],
  (cards, previewId) => cards.find((c) => c.id === previewId) || null,
)

export const selectCardsByDateMap = createSelector(
  [
    selectCalendarIndex,
    // (1) Используем тот самый селектор, который мы вылизали для Пирога!
    selectCardphotoPreview,
    selectSelectedDate,
  ],
  (index, photoPreview, activeDate) => {
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

    // 1. Заполняем из базы
    Object.keys(index).forEach((k) => {
      const key = k as keyof CardCalendarIndex
      const data = index[key]
      if (!data) return

      if (Array.isArray(data)) {
        data.forEach((item) => {
          const entry = getEntry(item.date)
          if (key !== 'processed') (entry[key] as CalendarCardItem[]).push(item)
        })
      } else {
        const entry = getEntry(data.date)
        entry.processed = data
      }
    })

    // 2. ГИДРАТАЦИЯ (Наложение живых данных из Пирога)
    if (activeDate && photoPreview) {
      const entry = getEntry(activeDate)

      entry.processed = {
        cardId: 'current_session',
        date: activeDate,
        // (2) Берем тот самый стабильный URL, который подготовил Пирог
        previewUrl: photoPreview.previewUrl || '',
        status: 'processed',
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
