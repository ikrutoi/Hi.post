import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, StoreAdapter } from '@db/types'

export const cartAdapter: StoreAdapter<StoreMap['cart']> =
  createStoreAdapter<StoreMap['cart']>('cart')
