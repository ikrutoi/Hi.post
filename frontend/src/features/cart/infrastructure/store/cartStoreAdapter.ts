import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['cart']>('cart')

export interface ExtendedCartStoreAdapter
  extends StoreAdapter<StoreMap['cart']> {
  addUniqueRecord: (payload: Omit<StoreMap['cart'], 'id'>) => Promise<void>
}

export const cartStoreAdapter: ExtendedCartStoreAdapter = {
  ...base,
  async addUniqueRecord(payload) {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
