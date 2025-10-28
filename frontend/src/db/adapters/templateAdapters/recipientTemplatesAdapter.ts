import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { TemplateStoreMap, RecipientTemplatesAdapter } from '@/db/types'

const base =
  createStoreAdapter<TemplateStoreMap['recipient']>('recipientTemplates')

export const recipientTemplatesAdapter: RecipientTemplatesAdapter = {
  ...base,
  addUniqueRecord: async (payload) => {
    const localId = (await base.getMaxLocalId()) + 1
    await base.put({ localId, ...payload })
  },
}
