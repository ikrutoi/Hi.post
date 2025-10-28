import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { TemplateStoreMap, SenderTemplatesAdapter } from '@/db/types'

const base = createStoreAdapter<TemplateStoreMap['sender']>('senderTemplates')

export const senderTemplatesAdapter: SenderTemplatesAdapter = {
  ...base,
  addUniqueRecord: async (payload) => {
    const localId = (await base.getMaxLocalId()) + 1
    await base.put({ localId, ...payload })
  },
}
