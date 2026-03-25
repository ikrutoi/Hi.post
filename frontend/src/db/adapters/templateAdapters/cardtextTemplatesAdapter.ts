import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { CardtextTemplateItemShape } from '@entities/templates/domain/types'
import type { CardtextTemplatesAdapter } from './templatesStoreAdapters'

const base = createStoreAdapter<CardtextTemplateItemShape>('cardtext')

export const cardtextTemplatesAdapter: CardtextTemplatesAdapter = {
  ...base,
  addTemplate: async (template) => {
    const id =
      template.id && String(template.id).trim() !== ''
        ? String(template.id)
        : String(Date.now())
    await base.put({ ...template, id } as CardtextTemplateItemShape & { id: string })
  },
}
