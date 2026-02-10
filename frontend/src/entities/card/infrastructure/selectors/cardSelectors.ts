import { RootState } from '@app/state'
import { createSelector } from '@reduxjs/toolkit'
import { CalendarCardItem, CardCalendarIndex } from '../../domain/types'
import { selectIsAromaComplete } from '@aroma/infrastructure/selectors'
import { selectIsEnvelopeReady } from '@envelope/infrastructure/selectors'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import { selectIsDateComplete } from '@date/infrastructure/selectors'

export const selectCardState = (state: RootState) => state.card

export const selectAllCards = (state: RootState) => selectCardState(state).cards

export const selectCalendarIndex = (state: RootState) =>
  selectCardState(state).calendarIndex

export const selectCardById = (id: string) => (state: RootState) =>
  state.card.cards.find((card) => card.id === id)

export const selectCardsByDateMap = createSelector(
  [selectCalendarIndex],
  (index: CardCalendarIndex) => {
    const map: Record<
      string,
      {
        processed: CalendarCardItem | null
        cart: CalendarCardItem[]
        sent: CalendarCardItem[]
      }
    > = {}

    const getEntry = (date: { year: number; month: number; day: number }) => {
      const key = `${date.year}-${date.month}-${date.day}`
      if (!map[key]) {
        map[key] = { processed: null, cart: [], sent: [] }
      }
      return map[key]
    }

    if (index.processed) {
      const entry = getEntry(index.processed.date)
      entry.processed = index.processed
    }

    index.cart.forEach((item) => {
      const entry = getEntry(item.date)
      entry.cart.push(item)
    })

    index.sent.forEach((item) => {
      const entry = getEntry(item.date)
      entry.sent.push(item)
    })

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
