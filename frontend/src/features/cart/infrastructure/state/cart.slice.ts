import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cart, CartItem } from '../../domain/types/cart.types'

const initialState: Cart = []

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<Cart>) {
      return action.payload
    },
    addCartItem(state, action: PayloadAction<CartItem>) {
      state.push(action.payload)
    },
    clearCart() {
      return []
    },
  },
})

export const cartActions = cartSlice.actions
export default cartSlice.reducer
