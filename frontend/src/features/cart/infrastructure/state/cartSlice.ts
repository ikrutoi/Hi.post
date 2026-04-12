import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cart } from '@cart/domain/types'
import type { Postcard } from '@entities/postcard'

const initialState: Cart = {
  items: [],
  amount: {
    value: 0,
    currency: 'BYN',
  },
  isActive: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartListPanelOpen(state, action: PayloadAction<boolean>) {
      state.isActive = action.payload
    },
    setItems(state, action: PayloadAction<Postcard[]>) {
      state.items = action.payload
    },
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

export const {
  setCartListPanelOpen,
  setItems,
  addItem,
  removeItem,
  updateItem,
  clearCart,
} = cartSlice.actions
export default cartSlice.reducer
