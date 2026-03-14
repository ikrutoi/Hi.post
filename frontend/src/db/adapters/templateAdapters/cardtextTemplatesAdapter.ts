import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { CardtextTemplateItemShape } from '@entities/templates/domain/types'
import type { CardtextTemplatesAdapter } from './templatesStoreAdapters'

const base = createStoreAdapter<CardtextTemplateItemShape>('cardtext')

export const cardtextTemplatesAdapter: CardtextTemplatesAdapter = {
  ...base,
  addTemplate: async (template) => {
    const nextLocalId = (await base.getMaxLocalId()) + 1
    const localId = template.localId ?? nextLocalId
    const id =
      template.id && String(template.id).trim() !== ''
        ? String(template.id)
        : String(localId)
    await base.put({ ...template, id, localId } as CardtextTemplateItemShape & {
      id: string
    })
  },
}
