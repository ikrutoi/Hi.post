import { createStoreAdapter } from '../factory/createStoreAdapter'
import type { CartItem } from '@entities/cart/domain/types'

export const cartAdapter = createStoreAdapter<CartItem>('cart')
