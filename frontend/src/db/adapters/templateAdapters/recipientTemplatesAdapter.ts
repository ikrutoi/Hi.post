import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { TemplateStoreMap } from '@/db/types'
import type { RecipientTemplatesAdapter } from './templatesStoreAdapters'

const base =
  createStoreAdapter<TemplateStoreMap['recipient']>('recipient')

export const recipientTemplatesAdapter: RecipientTemplatesAdapter = {
  ...base,
  addUniqueRecord: async (payload) => {
    const localId = (await base.getMaxLocalId()) + 1
    const listStatus = payload.listStatus ?? 'inList'
    const favorite =
      listStatus === 'outList' ? null : (payload.favorite ?? false)
    await base.put({ ...payload, localId, listStatus, favorite })
  },
}
