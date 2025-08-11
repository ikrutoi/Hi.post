import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['postcardDrafts']>('postcardDrafts')

export const postcardDraftsAdapter: StoreAdapter<StoreMap['postcardDrafts']> = {
  ...base,
  addUniqueRecord: async (payload: Omit<StoreMap['postcardDrafts'], 'id'>) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
