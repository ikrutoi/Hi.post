import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Cart, CartListStatusSegment } from '@cart/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { AromaItem } from '@entities/aroma/domain/types'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'

const emptyListSelectedLocalIdsBySegment = (): Cart['listSelectedLocalIdsBySegment'] => ({
  cart: null,
  cartBlocked: null,
})

function pruneListSelectedLocalIdsBySegment(
  state: Cart,
): void {
  const bySegment = state.listSelectedLocalIdsBySegment
  for (const segment of ['cart', 'cartBlocked'] as const satisfies readonly CartListStatusSegment[]) {
    const localId = bySegment[segment]
    if (localId == null) continue
    const postcard = state.items.find((item) => item.localId === localId)
    if (postcard == null || postcard.status !== segment) {
      bySegment[segment] = null
    }
  }
}

function normalizeCartLikeStatus(item: PostcardHydrated): PostcardHydrated {
  if (item.status !== 'cart' && item.status !== 'cartBlocked') return item
  const nextStatus = isDispatchDateDisabledForOrder(item.date, getCurrentDate())
    ? 'cartBlocked'
    : 'cart'
  if (item.status === nextStatus) return item
  return { ...item, status: nextStatus }
}

const initialState: Cart = {
  items: [],
  amount: {
    value: 0,
    currency: 'BYN',
  },
  isActive: false,
  listSelectedLocalIdsBySegment: emptyListSelectedLocalIdsBySegment(),
  cardPieCopyStripExpanded: false,
  listStatusSegment: 'cart',
  listCheckedLocalIds: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartListPanelOpen(state, action: PayloadAction<boolean>) {
      const wasOpen = state.isActive
      state.isActive = action.payload
      if (!action.payload) {
        state.cardPieCopyStripExpanded = false
        return
      }
    },
    setCardPieCopyStripExpanded(state, action: PayloadAction<boolean>) {
      state.cardPieCopyStripExpanded = action.payload
    },
    setCartListSelectedLocalId(state, action: PayloadAction<number | null>) {
      state.listSelectedLocalIdsBySegment[state.listStatusSegment] =
        action.payload
    },
    setCartListStatusSegment(
      state,
      action: PayloadAction<Cart['listStatusSegment']>,
    ) {
      state.listStatusSegment = action.payload
    },
    toggleCartListEntryChecked(state, action: PayloadAction<number>) {
      const id = action.payload
      const index = state.listCheckedLocalIds.indexOf(id)
      if (index >= 0) {
        state.listCheckedLocalIds.splice(index, 1)
      } else {
        state.listCheckedLocalIds.push(id)
      }
    },
    setCartListCheckedLocalIds(state, action: PayloadAction<number[]>) {
      state.listCheckedLocalIds = action.payload
    },
    setItems(state, action: PayloadAction<PostcardHydrated[]>) {
      state.items = action.payload.map(normalizeCartLikeStatus)
      pruneListSelectedLocalIdsBySegment(state)
    },
    addItem(state, action: PayloadAction<PostcardHydrated>) {
      const item = normalizeCartLikeStatus(action.payload)
      state.items.push(item)
      /** Новая открытка в сегменте «Корзина» (актуальная дата) — сразу с чекбоксом. */
      if (
        item.status === 'cart' &&
        !isDispatchDateDisabledForOrder(item.date, getCurrentDate()) &&
        !state.listCheckedLocalIds.includes(item.localId)
      ) {
        state.listCheckedLocalIds.push(item.localId)
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      const removed = action.payload
      state.items = state.items.filter((item) => item.localId !== removed)
      for (const segment of ['cart', 'cartBlocked'] as const satisfies readonly CartListStatusSegment[]) {
        if (state.listSelectedLocalIdsBySegment[segment] === removed) {
          state.listSelectedLocalIdsBySegment[segment] = null
        }
      }
      state.listCheckedLocalIds = state.listCheckedLocalIds.filter(
        (lid) => lid !== removed,
      )
    },
    updateItem(state, action: PayloadAction<PostcardHydrated>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id,
      )
      if (index !== -1) {
        state.items[index] = normalizeCartLikeStatus(action.payload)
        pruneListSelectedLocalIdsBySegment(state)
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
      state.listSelectedLocalIdsBySegment = emptyListSelectedLocalIdsBySegment()
      state.cardPieCopyStripExpanded = false
      state.listStatusSegment = 'cart'
      state.listCheckedLocalIds = []
    },
    /** Saga-only: удалить открытку из IDB, затем `removeItem` в Redux. */
    removeCartPostcard(_state, _action: PayloadAction<number>) {},
  },
})

export const {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
  setCartListStatusSegment,
  toggleCartListEntryChecked,
  setCartListCheckedLocalIds,
  setCardPieCopyStripExpanded,
  setItems,
  addItem,
  removeItem,
  updateItem,
  setCartItemCardAroma,
  clearCart,
  removeCartPostcard,
} = cartSlice.actions
export default cartSlice.reducer
