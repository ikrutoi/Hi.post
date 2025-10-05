import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, RecipientAddressAdapter } from '@db/types'

const base =
  createStoreAdapter<StoreMap['recipientAddress']>('recipientAddress')

export const recipientAddressAdapter: RecipientAddressAdapter = {
  ...base,
  addUniqueRecord: async (payload) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
