import {
  normalizePostcardRecord,
  type PostcardHydrated,
} from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { fetchPostcardSyncApi } from '../../api/postcardSync.api'
import { mergePostcardsLastWriteWins } from '../../domain/mergePostcardsLastWriteWins'
import { enqueuePostcardUpsert } from '../../infrastructure/postcardV2PendingSync'
import { fetchV2Postcards } from '../../infrastructure/v2PostcardRemote'

async function loadRemoteRows(): Promise<{
  rows: PostcardHydrated[]
  fromLegacySnapshot: boolean
}> {
  const v2 = await fetchV2Postcards()
  if (v2.length > 0) {
    return { rows: v2.map(normalizePostcardRecord), fromLegacySnapshot: false }
  }

  try {
    const snapshot = await fetchPostcardSyncApi()
    const rows = (snapshot?.postcards ?? []).map(normalizePostcardRecord)
    return { rows, fromLegacySnapshot: rows.length > 0 }
  } catch {
    return { rows: [], fromLegacySnapshot: false }
  }
}

/**
 * Pull remote rows, last-write-wins merge into IndexedDB, queue local winners
 * for debounce upsert. Empty v2 falls back to read-only snapshot (migration).
 */
export async function pullV2PostcardsIntoIdb(): Promise<number> {
  const { rows: remote, fromLegacySnapshot } = await loadRemoteRows()
  const local = await postcardsAdapter.getAll()
  const { nextLocal, push } = mergePostcardsLastWriteWins(local, remote)

  for (const row of nextLocal) {
    await postcardsAdapter.putLocal(row)
  }

  const toPush = fromLegacySnapshot ? nextLocal : push
  for (const row of toPush) {
    enqueuePostcardUpsert(row)
  }

  return nextLocal.length
}
