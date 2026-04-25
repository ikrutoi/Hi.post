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
  listSelectedLocalId: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartListPanelOpen(state, action: PayloadAction<boolean>) {
      state.isActive = action.payload
      /** Сброс выбора при открытии/закрытии: правый CardPie только после клика по строке. */
      state.listSelectedLocalId = null
    },
    setCartListSelectedLocalId(state, action: PayloadAction<number | null>) {
      state.listSelectedLocalId = action.payload
    },
    setItems(state, action: PayloadAction<Postcard[]>) {
      state.items = action.payload
    },
    addItem(state, action: PayloadAction<Postcard>) {
      state.items.push(action.payload)
    },
    removeItem(state, action: PayloadAction<number>) {
      const removed = action.payload
      state.items = state.items.filter((item) => item.localId !== removed)
      if (state.listSelectedLocalId === removed) {
        state.listSelectedLocalId = null
      }
    },
    updateItem(state, action: PayloadAction<Postcard>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      )
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    clearCart(state) {
      state.items = []
      state.amount = { value: 0, currency: state.amount.currency }
      state.listSelectedLocalId = null
    },
  },
})

export const {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
  setItems,
  addItem,
  removeItem,
  updateItem,
  clearCart,
} = cartSlice.actions
export default cartSlice.reducer
