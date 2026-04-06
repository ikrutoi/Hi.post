import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import { normalizePostcardRecord, type Postcard } from '@entities/postcard'
import type { CartTemplatesAdapter } from './templatesStoreAdapters'

const base = createStoreAdapter<Postcard>('cartTemplates')

export const cartTemplatesAdapter: CartTemplatesAdapter = {
  ...base,
  getAll: async () => (await base.getAll()).map(normalizePostcardRecord),
  getById: async (id: IDBValidKey) => {
    const r = await base.getById(id)
    return r ? normalizePostcardRecord(r) : null
  },
}
