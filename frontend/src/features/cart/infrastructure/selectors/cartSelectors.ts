import type { RootState } from '@app/state'
import type { CartAmount, CartListStatusSegment } from '@cart/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import { createSelector } from '@reduxjs/toolkit'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import {
  cartBillablePostcards,
  cartListTotalDisplayFromPostcards,
  cartListTotalNumeric,
} from '@cart/application/logic/cartListTotalDisplay'

export const selectCartListPanelOpen = (state: RootState): boolean =>
  state.cart.isActive

export const selectCartListSelectedLocalId = (state: RootState): number | null =>
  state.cart.listSelectedLocalId

export const selectCartListStatusSegment = (
  state: RootState,
): CartListStatusSegment =>
  state.cart.listStatusSegment ?? 'cart'

export const selectCartItems = (state: RootState): PostcardHydrated[] =>
  state.cart.items

const selectCartPostcardsForBadge = createSelector(
  [selectCartItems],
  (cartItems) =>
    cartItems.filter(
      (item) => item.status === 'cart' || item.status === 'cartBlocked',
    ),
)

/** Активные открытки корзины (дата отправки ещё доступна для заказа). */
export const selectActiveCartPostcardCount = createSelector(
  [selectCartPostcardsForBadge],
  (cartItems) => {
    const currentDate = getCurrentDate()
    return cartItems.filter(
      (item) => !isDispatchDateDisabledForOrder(item.date, currentDate),
    ).length
  },
)

/** Заблокированные открытки корзины (дата отправки уже недоступна). */
export const selectBlockedCartPostcardCount = createSelector(
  [selectCartPostcardsForBadge],
  (cartItems) => {
    const currentDate = getCurrentDate()
    return cartItems.filter((item) =>
      isDispatchDateDisabledForOrder(item.date, currentDate),
    ).length
  },
)

// export const selectCartAmount = (state: RootState): CartAmount => {
//   const items: Postcard[] = state.cart.items.filter(
//     (item) => item.status === 'cart',
//   )

//   const total = items.reduce((sum, item) => {
//     const price = parseFloat(item.price)
//     return sum + (isNaN(price) ? 0 : price)
//   }, 0)

//   return {
//     value: total,
//     currency: 'BYN',
//   }
// }

export const selectCartCount = (state: RootState): number =>
  state.cart.items.filter((item) => item.status === 'cart').length

export const selectCardPieCopyStripExpanded = (state: RootState): boolean =>
  Boolean(state.cart.cardPieCopyStripExpanded)

export const selectCartListCheckedLocalIds = (state: RootState): number[] =>
  state.cart.listCheckedLocalIds ?? []

export const selectIsCartListEntryChecked = (
  state: RootState,
  localId: number,
): boolean => state.cart.listCheckedLocalIds?.includes(localId) ?? false

export const selectCartBillablePostcards = createSelector(
  [selectCartItems],
  (items) => cartBillablePostcards(items),
)

export const selectCartBillableTotalNumeric = createSelector(
  [selectCartBillablePostcards],
  (postcards) => cartListTotalNumeric(postcards),
)

export const selectCartBillableTotalDisplay = createSelector(
  [selectCartBillablePostcards],
  (postcards) => cartListTotalDisplayFromPostcards(postcards),
)
