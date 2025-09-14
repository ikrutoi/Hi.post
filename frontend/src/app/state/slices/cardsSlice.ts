import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Card = {
  id: string
  title: string
  description: string
  location: 'hub' | 'cart' | 'history'
}

type CardsState = Record<string, Card>

const initialState: CardsState = {}

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<Card>) => {
      state[action.payload.id] = action.payload
    },
    updateLocation: (
      state,
      action: PayloadAction<{ id: string; location: Card['location'] }>
    ) => {
      const card = state[action.payload.id]
      if (card) {
        card.location = action.payload.location
      }
    },
    updateCard: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<Card> }>
    ) => {
      const card = state[action.payload.id]
      if (card) {
        Object.assign(card, action.payload.changes)
      }
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      delete state[action.payload]
    },
    addManyCards: (state, action: PayloadAction<Card[]>) => {
      action.payload.forEach((card) => {
        state[card.id] = card
      })
    },
    clearCards: () => {
      return {}
    },
  },
})

export const {
  addCard,
  updateLocation,
  updateCard,
  deleteCard,
  addManyCards,
  clearCards,
} = cardsSlice.actions

export default cardsSlice.reducer
