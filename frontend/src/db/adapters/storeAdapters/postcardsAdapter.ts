import { createStoreAdapter } from '../factory/createStoreAdapter'
import {
  normalizePostcardRecord,
  type PostcardHydrated,
} from '@entities/postcard'
import {
  enqueuePostcardDelete,
  enqueuePostcardUpsert,
  isPostcardPendingDelete,
} from '@features/sync/infrastructure/postcardV2PendingSync'

const base = createStoreAdapter<PostcardHydrated>('postcards')

async function putLocal(
  record: PostcardHydrated & { id: IDBValidKey },
): Promise<void> {
  await base.put(normalizePostcardRecord(record))
}

async function deleteStoredPostcard(
  localId: number,
  id?: string,
): Promise<void> {
  const rows = await base.getAll()
  const keys = new Set<IDBValidKey>()
  for (const row of rows) {
    const raw = row as PostcardHydrated & { id?: IDBValidKey }
    const rawId = raw.id
    const sameLocal = raw.localId === localId
    const sameId =
      id != null &&
      rawId != null &&
      (rawId === id || String(rawId) === id)
    if (!sameLocal && !sameId) continue
    if (rawId != null) keys.add(rawId)
  }
  if (id) {
    keys.add(id)
    if (/^\d+$/.test(id)) keys.add(Number(id))
  }
  for (const key of keys) {
    await base.deleteById(key)
    enqueuePostcardDelete(String(key), localId)
  }
}

async function forgetLocal(id: string): Promise<void> {
  const rows = await base.getAll()
  const keys = new Set<IDBValidKey>()
  keys.add(id)
  if (/^\d+$/.test(id)) keys.add(Number(id))
  for (const row of rows) {
    const raw = row as PostcardHydrated & { id?: IDBValidKey }
    if (raw.id == null) continue
    if (raw.id === id || String(raw.id) === id) keys.add(raw.id)
  }
  for (const key of keys) {
    await base.deleteById(key)
  }
}

async function purgePendingDeletes(): Promise<void> {
  const rows = await base.getAll()
  for (const row of rows) {
    const raw = row as PostcardHydrated & { id?: IDBValidKey }
    if (raw.id == null || !isPostcardPendingDelete(raw)) continue
    await base.deleteById(raw.id)
    enqueuePostcardDelete(
      String(raw.id),
      typeof raw.localId === 'number' ? raw.localId : null,
    )
  }
}

/** Canonical store for all user postcards (from cart onward); one row per postcard. */
export const postcardsAdapter = {
  ...base,
  putLocal,
  deleteStoredPostcard,
  forgetLocal,
  purgePendingDeletes,
  getAll: async () => (await base.getAll()).map(normalizePostcardRecord),
  getById: async (id: IDBValidKey) => {
    const r = await base.getById(id)
    return r ? normalizePostcardRecord(r) : null
  },
  put: async (record: PostcardHydrated & { id: IDBValidKey }): Promise<void> => {
    const normalized = normalizePostcardRecord(record)
    await base.put(normalized)
    enqueuePostcardUpsert(normalized)
  },
  deleteById: async (id: IDBValidKey): Promise<void> => {
    await base.deleteById(id)
    enqueuePostcardDelete(String(id))
  },
}
