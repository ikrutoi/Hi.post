import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import type { StoreMap } from '@/db/types'
import { normalizeDraftsItemRecord } from '@entities/drafts/domain/types'
import type { DraftsTemplatesAdapter } from './templatesStoreAdapters'

const base = createStoreAdapter<StoreMap['drafts']>('draftsTemplates')

export const draftsTemplatesAdapter: DraftsTemplatesAdapter = {
  ...base,
  getAll: async () => (await base.getAll()).map(normalizeDraftsItemRecord),
  getById: async (id: IDBValidKey) => {
    const r = await base.getById(id)
    return r ? normalizeDraftsItemRecord(r) : null
  },
}
