import type { RootState } from '@app/store/store'

export const selectCartItems = (state: RootState) => state.cart
export const selectCartCount = (state: RootState) => state.cart.length
