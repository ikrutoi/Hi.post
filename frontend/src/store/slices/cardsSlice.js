import { createSlice } from '@reduxjs/toolkit'

const cardsSlice = createSlice({
  name: 'cards',
  initialState: [],
  reducers: {
    addCard: (state, action) => {
      state.push(action.payload)
    },
    deleteCard: (state, action) => {
      return state.filter((card) => card.id !== action.payload)
    },
  },
})

export const { addCard, deleteCard } = cardsSlice.actions
export default cardsSlice.reducer
