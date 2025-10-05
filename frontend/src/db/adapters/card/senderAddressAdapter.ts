import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, SenderAddressAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['senderAddress']>('senderAddress')

export const senderAddressAdapter: SenderAddressAdapter = {
  ...base,
  addUniqueRecord: async (payload) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
