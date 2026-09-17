import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { CardtextContent } from '@cardtext/domain/types'
import type { CardtextTemplatesAdapter } from './templatesStoreAdapters'
import { withLibraryRemoteSync } from '@features/sync/infrastructure/withLibraryRemoteSync'

const base = createStoreAdapter<CardtextContent>('cardtext')
const synced = withLibraryRemoteSync(base, 'cardtexts')

export const cardtextTemplatesAdapter: CardtextTemplatesAdapter = {
  ...synced,
  addTemplate: async (template) => {
    const id =
      template.id && String(template.id).trim() !== ''
        ? String(template.id)
        : String(Date.now())
    await synced.put({ ...template, id } as CardtextContent & { id: string })
  },
}
