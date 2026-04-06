import { createStoreAdapter } from '@db/adapters/factory/createStoreAdapter'
import { normalizePostcardRecord, type Postcard } from '@entities/postcard'

const base = createStoreAdapter<Postcard>('cart')

export const cartStore = {
  ...base,
  getAll: async () => (await base.getAll()).map(normalizePostcardRecord),
  getById: async (id: IDBValidKey) => {
    const r = await base.getById(id)
    return r ? normalizePostcardRecord(r) : null
  },
}
