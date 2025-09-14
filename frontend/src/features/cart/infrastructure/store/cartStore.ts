import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { CartPostcard } from '../../domain/types/cart.types'

export const cartStore = createStoreAdapter<CartPostcard>('cart')
