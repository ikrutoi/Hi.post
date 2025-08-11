import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base =
  createStoreAdapter<StoreMap['assetSenderAddress']>('assetSenderAddress')

export const assetSenderAddressAdapter: StoreAdapter<
  StoreMap['assetSenderAddress']
> = {
  ...base,
  addUniqueRecord: async (
    payload: Omit<StoreMap['assetSenderAddress'], 'id'>
  ) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
