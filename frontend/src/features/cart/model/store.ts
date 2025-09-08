import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { Cart } from '../domain/cartModel'

export const cartStore = createStoreAdapter<Cart>('cart')
