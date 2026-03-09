import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap, RecipientAdapter } from '@/db/types'

const base = createStoreAdapter<StoreMap['recipient']>('recipient')

export const recipientAdapter: RecipientAdapter = {
  ...base,
  addUniqueRecord: async (payload) => {
    const localId = (await base.getMaxLocalId()) + 1
    const listStatus = payload.listStatus ?? 'inList'
    const favorite =
      listStatus === 'notInList' ? null : (payload.favorite ?? false)
    await base.put({ localId, listStatus, favorite, ...payload })
  },
}
