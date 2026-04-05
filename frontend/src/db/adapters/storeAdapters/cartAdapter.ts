import { createStoreAdapter } from '../factory/createStoreAdapter'
import type { Postcard } from '@entities/cart/domain/types'

export const cartAdapter = createStoreAdapter<Postcard>('cart')
