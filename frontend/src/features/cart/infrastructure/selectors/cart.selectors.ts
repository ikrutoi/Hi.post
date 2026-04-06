import type { RootState } from '@app/state'
import type { CartAmount } from '@cart/domain/types'
import type { Postcard } from '@entities/postcard'

export const selectCartAmount = (state: RootState): CartAmount => {
  const items: Postcard[] = state.cart.items

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
