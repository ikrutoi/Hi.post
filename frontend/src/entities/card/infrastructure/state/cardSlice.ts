import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Card } from '../../domain/types'
import type { CardphotoState } from '@entities/cardphoto'
import type { CardtextState } from '@entities/cardtext'
import type { EnvelopeState } from '@envelope/domain/types'
import type { AromaItem } from '@entities/aroma'
import type { DispatchDate } from '@entities/date'

export type CardState = {
  cards: Card[]
}

const initialState: CardState = {
  cards: [],
}

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    addCard(
      state,
      action: PayloadAction<{
        id: string
        status: Card['status']
        cardphoto: CardphotoState
        cardtext: CardtextState
        envelope: EnvelopeState
        aroma: AromaItem
        date: DispatchDate
      }>
    ) {
      const { id, status, cardphoto, cardtext, envelope, aroma, date } =
        action.payload

      state.cards.push({
        id,
        status,
        cardphoto,
        cardtext,
        envelope,
        aroma,
        date,
      })
    },

    updateCardStatus(
      state,
      action: PayloadAction<{ id: string; status: Card['status'] }>
    ) {
      const card = state.cards.find((c) => c.id === action.payload.id)
      if (card) {
        card.status = action.payload.status
      }
    },

    removeCard(state, action: PayloadAction<{ id: string }>) {
      state.cards = state.cards.filter((c) => c.id !== action.payload.id)
    },
  },
})

export const { addCard, updateCardStatus, removeCard } = cardSlice.actions
export default cardSlice.reducer
