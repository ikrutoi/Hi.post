import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base =
  createStoreAdapter<StoreMap['recipientAddress']>('recipientAddress')

export const recipientAddressAdapter: StoreAdapter<
  StoreMap['recipientAddress']
> = {
  ...base,
  addUniqueRecord: async (
    payload: Omit<StoreMap['recipientAddress'], 'id'>
  ) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
