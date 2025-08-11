import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['assetRecipientAddress']>(
  'assetRecipientAddress'
)

export const assetRecipientAddressAdapter: StoreAdapter<
  StoreMap['assetRecipientAddress']
> = {
  ...base,
  addUniqueRecord: async (
    payload: Omit<StoreMap['assetRecipientAddress'], 'id'>
  ) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
