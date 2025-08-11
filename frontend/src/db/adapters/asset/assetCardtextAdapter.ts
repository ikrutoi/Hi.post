import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['assetCardtext']>('assetCardtext')

export const assetCardtextAdapter: StoreAdapter<StoreMap['assetCardtext']> = {
  ...base,
  addUniqueRecord: async (text: Record<string, string>) => {
    const maxId = await base.getMaxId()
    const newId = maxId + 1
    await base.put({ id: newId, text })
  },
}
