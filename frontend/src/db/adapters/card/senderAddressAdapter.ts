import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@db/types/storeMap'
import type { StoreAdapter } from '@db/types'

const base = createStoreAdapter<StoreMap['senderAddress']>('senderAddress')

export const senderAddressAdapter: StoreAdapter<StoreMap['senderAddress']> = {
  ...base,
  addUniqueRecord: async (payload: Omit<StoreMap['senderAddress'], 'id'>) => {
    const id = (await base.getMaxId()) + 1
    await base.put({ id, ...payload })
  },
}
