import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Card, CardCalendarIndex } from '../../domain/types'

interface CardState {
  cards: Card[]
  calendarIndex: CardCalendarIndex
  isReady: boolean
}

const initialState: CardState = {
  cards: [],
  calendarIndex: {
    processed: null,
    cart: [],
    sent: [],
  },
  isReady: false,
}

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setCardReadyStatus: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload
      if (!action.payload) {
        state.calendarIndex.processed = null
      }
    },

    syncProcessedRequest: (state) => state,

    setProcessedCard: (state, action: PayloadAction<Card>) => {
      console.log('SetProcessesCard')
      const index = state.cards.findIndex((c) => c.id === action.payload.id)
      if (index !== -1) state.cards[index] = action.payload
      else state.cards.push(action.payload)

      state.calendarIndex.processed = {
        cardId: action.payload.id,
        date: action.payload.date,
        previewUrl: action.payload.thumbnailUrl,
      }
      state.isReady = true
    },

    clearProcessed: (state) => {
      state.calendarIndex.processed = null
      state.isReady = false
    },
  },
})

export const {
  setCardReadyStatus,
  syncProcessedRequest,
  setProcessedCard,
  clearProcessed,
} = cardSlice.actions
export default cardSlice.reducer
