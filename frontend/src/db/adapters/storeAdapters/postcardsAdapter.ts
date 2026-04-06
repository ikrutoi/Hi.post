import { createStoreAdapter } from '../factory/createStoreAdapter'
import { normalizePostcardRecord, type Postcard } from '@entities/postcard'

const base = createStoreAdapter<Postcard>('postcards')

/** Canonical store for all user postcards (from cart onward); one row per postcard. */
export const postcardsAdapter = {
  ...base,
  getAll: async () => (await base.getAll()).map(normalizePostcardRecord),
  getById: async (id: IDBValidKey) => {
    const r = await base.getById(id)
    return r ? normalizePostcardRecord(r) : null
  },
}
