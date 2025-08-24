import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { Cart } from './types'

export const cartStore = createStoreAdapter<Cart>('cart')
