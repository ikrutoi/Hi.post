import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@/db/types'
import type { SenderTemplatesAdapter } from './templatesStoreAdapters'

const base = createStoreAdapter<StoreMap['sender']>('sender')

export const senderTemplatesAdapter: SenderTemplatesAdapter = {
  ...base,
  addUniqueRecord: async (payload) => {
    const localId = (await base.getMaxLocalId()) + 1
    const listStatus = payload.listStatus ?? 'inList'
    const favorite =
      listStatus === 'outList' ? null : (payload.favorite ?? false)
    await base.put({ ...payload, localId, listStatus, favorite })
  },
}
