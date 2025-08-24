import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['cart']>('cart')

export const cartAdapter: StoreAdapter<StoreMap['cart']> = {
  ...base,
  addUniqueRecord: async (payload: Omit<StoreMap['cart'], 'id'>) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
