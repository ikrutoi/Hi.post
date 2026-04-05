import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cart, Postcard } from '@entities/cart/domain/types'

const initialState: Cart = {
  items: [],
  amount: {
    value: 0,
    currency: 'BYN',
  },
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Postcard>) {
      state.items.push(action.payload)
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.LocalId !== action.payload,
      )
    },
    updateItem(state, action: PayloadAction<Postcard>) {
      const index = state.items.findIndex(
        (item) => item.LocalId === action.payload.LocalId,
      )
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    clearCart(state) {
      state.items = []
      state.amount = { value: 0, currency: state.amount.currency }
    },
  },
})

export const { addItem, removeItem, updateItem, clearCart } = cartSlice.actions
export default cartSlice.reducer
