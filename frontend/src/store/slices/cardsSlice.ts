import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Card = {
  id: string
  title: string
  description: string
  // добавь нужные поля: image, tags, etc.
}

const initialState: Card[] = []

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<Card>) => {
      state.push(action.payload)
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      return state.filter((card) => card.id !== action.payload)
    },
  },
})

export const { addCard, deleteCard } = cardsSlice.actions
export default cardsSlice.reducer
