import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['drafts']>('drafts')

export const draftsAdapter: StoreAdapter<StoreMap['drafts']> = {
  ...base,
  addUniqueRecord: async (payload: Omit<StoreMap['drafts'], 'id'>) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
