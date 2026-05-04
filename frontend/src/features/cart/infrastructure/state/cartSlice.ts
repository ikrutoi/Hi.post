import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cart } from '@cart/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { AromaItem } from '@entities/aroma/domain/types'

const initialState: Cart = {
  items: [],
  amount: {
    value: 0,
    currency: 'BYN',
  },
  isActive: false,
  listSelectedLocalId: null,
  cardPieCopyStripExpanded: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartListPanelOpen(state, action: PayloadAction<boolean>) {
      state.isActive = action.payload
      /** Сброс выбора при открытии/закрытии: правый CardPie только после клика по строке. */
      state.listSelectedLocalId = null
      if (!action.payload) {
        state.cardPieCopyStripExpanded = false
      }
    },
    setCardPieCopyStripExpanded(state, action: PayloadAction<boolean>) {
      state.cardPieCopyStripExpanded = action.payload
    },
    setCartListSelectedLocalId(state, action: PayloadAction<number | null>) {
      state.listSelectedLocalId = action.payload
    },
    setItems(state, action: PayloadAction<PostcardHydrated[]>) {
      state.items = action.payload
    },
    addItem(state, action: PayloadAction<PostcardHydrated>) {
      state.items.push(action.payload)
    },
    removeItem(state, action: PayloadAction<number>) {
      const removed = action.payload
      state.items = state.items.filter((item) => item.localId !== removed)
      if (state.listSelectedLocalId === removed) {
        state.listSelectedLocalId = null
      }
    },
    updateItem(state, action: PayloadAction<PostcardHydrated>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      )
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    setCartItemCardAroma(
      state,
      action: PayloadAction<{ localId: number; aroma: AromaItem }>,
    ) {
      const { localId, aroma } = action.payload
      const item = state.items.find((i) => i.localId === localId)
      if (item != null) {
        item.card.aroma = { ...aroma }
        item.postcard.aroma = String(aroma.index)
      }
    },
    clearCart(state) {
      state.items = []
      state.amount = { value: 0, currency: state.amount.currency }
      state.listSelectedLocalId = null
      state.cardPieCopyStripExpanded = false
    },
  },
})

export const {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
  setCardPieCopyStripExpanded,
  setItems,
  addItem,
  removeItem,
  updateItem,
  setCartItemCardAroma,
  clearCart,
} = cartSlice.actions
export default cartSlice.reducer
