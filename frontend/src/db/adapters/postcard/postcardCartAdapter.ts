import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['postcardCart']>('postcardCart')

export const postcardCartAdapter: StoreAdapter<StoreMap['postcardCart']> = {
  ...base,
  addUniqueRecord: async (payload: Omit<StoreMap['postcardCart'], 'id'>) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
