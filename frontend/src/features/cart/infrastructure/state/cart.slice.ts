import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cart, CartItem, CartItemMeta } from '@entities/cart/domain/types'

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
    addItem(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload)
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.LocalId !== action.payload
      )
    },
    updateItem(state, action: PayloadAction<CartItem>) {
      const index = state.items.findIndex(
        (item) => item.LocalId === action.payload.LocalId
      )
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    clearCart(state) {
      state.items = []
      state.amount = { value: 0, currency: state.amount.currency }
    },
    setItemMeta(
      state,
      action: PayloadAction<{ LocalId: number; meta: CartItemMeta }>
    ) {
      const item = state.items.find((i) => i.LocalId === action.payload.LocalId)
      if (item) {
        item.meta = action.payload.meta
      }
    },
  },
})

export const { addItem, removeItem, updateItem, clearCart, setItemMeta } =
  cartSlice.actions

export default cartSlice.reducer
