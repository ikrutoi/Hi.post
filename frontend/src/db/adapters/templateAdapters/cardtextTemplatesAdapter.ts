import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { CardtextTemplateItem } from '@cardtext/domain/types'
import type { CardtextTemplatesAdapter } from './templatesStoreAdapters'

const base = createStoreAdapter<CardtextTemplateItem>('cardtext')

export const cardtextTemplatesAdapter: CardtextTemplatesAdapter = {
  ...base,
  addTemplate: async (template) => {
    const maxId = await base.getMaxLocalId()
    const id = String(maxId + 1)
    await base.put({ ...template, id } as CardtextTemplateItem & { id: string })
  },
}
