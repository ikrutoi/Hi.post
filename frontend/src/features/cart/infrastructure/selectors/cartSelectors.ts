import type { RootState } from '@app/state'
import type { CartAmount } from '@cart/domain/types'
import type { PostcardHydrated } from '@entities/postcard'

export const selectCartListPanelOpen = (state: RootState): boolean =>
  state.cart.isActive

export const selectCartListSelectedLocalId = (state: RootState): number | null =>
  state.cart.listSelectedLocalId

export const selectCartItems = (state: RootState): PostcardHydrated[] =>
  state.cart.items

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
