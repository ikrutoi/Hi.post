import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { Postcard } from '@entities/postcard'

export const cartStore = createStoreAdapter<Postcard>('cart')
