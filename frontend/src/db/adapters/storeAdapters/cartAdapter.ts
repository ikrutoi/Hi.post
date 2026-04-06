import { createStoreAdapter } from '../factory/createStoreAdapter'
import type { Postcard } from '@entities/postcard'

export const cartAdapter = createStoreAdapter<Postcard>('cart')
