import type { RootState } from '@app/state'
import type { CartAmount, CartItem } from '@entities/cart/domain/types'

export const selectCartAmount = (state: RootState): CartAmount => {
  const items: CartItem[] = state.cart.items

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price)
    return sum + (isNaN(price) ? 0 : price)
  }, 0)

  return {
    value: total,
    currency: 'BYN',
  }
}

export const selectCartCount = (state: RootState): number =>
  state.cart.items.length
