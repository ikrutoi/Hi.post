import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { CardtextContent } from '@cardtext/domain/types'
import type { CardtextTemplatesAdapter } from './templatesStoreAdapters'

const base = createStoreAdapter<CardtextContent>('cardtext')

export const cardtextTemplatesAdapter: CardtextTemplatesAdapter = {
  ...base,
  addTemplate: async (template) => {
    const id =
      template.id && String(template.id).trim() !== ''
        ? String(template.id)
        : String(Date.now())
    await base.put({ ...template, id } as CardtextContent & { id: string })
  },
}
