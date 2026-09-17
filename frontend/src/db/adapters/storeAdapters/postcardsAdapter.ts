import { createStoreAdapter } from '../factory/createStoreAdapter'
import {
  normalizePostcardRecord,
  type PostcardHydrated,
} from '@entities/postcard'
import {
  deleteV2Postcard,
  upsertV2Postcard,
} from '@features/sync/infrastructure/v2PostcardRemote'

const base = createStoreAdapter<PostcardHydrated>('postcards')

async function putLocal(
  record: PostcardHydrated & { id: IDBValidKey },
): Promise<void> {
  await base.put(normalizePostcardRecord(record))
}

/** Canonical store for all user postcards (from cart onward); one row per postcard. */
export const postcardsAdapter = {
  ...base,
  putLocal,
  getAll: async () => (await base.getAll()).map(normalizePostcardRecord),
  getById: async (id: IDBValidKey) => {
    const r = await base.getById(id)
    return r ? normalizePostcardRecord(r) : null
  },
  put: async (record: PostcardHydrated & { id: IDBValidKey }): Promise<void> => {
    const normalized = normalizePostcardRecord(record)
    await base.put(normalized)
    try {
      await upsertV2Postcard(normalized)
    } catch {
      // IndexedDB is source of truth locally; retry on next save.
    }
  },
  deleteById: async (id: IDBValidKey): Promise<void> => {
    await base.deleteById(id)
    try {
      await deleteV2Postcard(String(id))
    } catch {
      // Local delete stays even if the server request fails.
    }
  },
}
