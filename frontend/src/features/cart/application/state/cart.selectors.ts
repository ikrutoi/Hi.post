import type { RootState } from '@app/state'

export const selectCartItems = (state: RootState) => state.cart
export const selectCartCount = (state: RootState) => state.cart.length
