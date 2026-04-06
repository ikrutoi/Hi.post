import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cart } from '@cart/domain/types'
import type { Postcard } from '@entities/postcard'

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
        (item) => item.localId !== action.payload,
      )
    },
    updateItem(state, action: PayloadAction<Postcard>) {
      const index = state.items.findIndex(
        (item) => item.localId === action.payload.localId,
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
