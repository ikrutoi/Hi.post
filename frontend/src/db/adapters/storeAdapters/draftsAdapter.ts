import { createStoreAdapter } from '../factory'
import {
  normalizeDraftsItemRecord,
  type DraftsItem,
} from '@entities/drafts/domain/types'

const base = createStoreAdapter<DraftsItem>('drafts')

export const draftsAdapter = {
  ...base,
  getAll: async () => (await base.getAll()).map(normalizeDraftsItemRecord),
  getById: async (id: IDBValidKey) => {
    const r = await base.getById(id)
    return r ? normalizeDraftsItemRecord(r) : null
  },
}
