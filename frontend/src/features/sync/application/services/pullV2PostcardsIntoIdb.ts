import {
  normalizePostcardRecord,
  type PostcardHydrated,
} from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { mergePostcardsLastWriteWins } from '../../domain/mergePostcardsLastWriteWins'
import { separateDuplicatePostcardLocalIds } from '../../domain/separateDuplicatePostcardLocalIds'
import {
  discardPendingPostcardUpsert,
  enqueuePostcardUpsert,
  flushPendingV2Sync,
  isPostcardPendingDelete,
  isPostcardSynced,
  pendingPostcardUpsertIds,
  pendingPostcardUpsertIdsWithBody,
  rememberSyncedPostcardIds,
} from '../../infrastructure/postcardV2PendingSync'
import { fetchV2Postcards } from '../../infrastructure/v2PostcardRemote'

/**
 * Pull remote v2 rows into IndexedDB.
 * Only an edit queued in this tab (upsert body still in memory) may beat the
 * server. A leftover id from localStorage is not a local edit — otherwise this
 * device pushes its older copy back and the other device never sees the change.
 */
let pullQueue: Promise<unknown> = Promise.resolve()

export function pullV2PostcardsIntoIdb(): Promise<number> {
  const run = pullQueue.then(pullV2PostcardsIntoIdbOnce, pullV2PostcardsIntoIdbOnce)
  pullQueue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

async function pullV2PostcardsIntoIdbOnce(): Promise<number> {
  await postcardsAdapter.purgePendingDeletes()
  const remote = (await fetchV2Postcards())
    .map(normalizePostcardRecord)
    .filter((row) => !isPostcardPendingDelete(row))
  const local = (await postcardsAdapter.getAll()).filter(
    (row) => !isPostcardPendingDelete(row),
  )
  rememberSyncedPostcardIds(
    remote.flatMap((row) => (row.id ? [row.id] : [])),
  )
  const remoteIds = new Set(remote.flatMap((row) => (row.id ? [row.id] : [])))
  const localById = new Map(local.flatMap((row) => (row.id ? [[row.id, row] as const] : [])))
  for (const id of pendingPostcardUpsertIds()) {
    if (pendingPostcardUpsertIdsWithBody().has(id)) continue
    const row = localById.get(id)
    if (row) enqueuePostcardUpsert(row)
  }
  const localDirtyIds = pendingPostcardUpsertIdsWithBody()
  /**
   * A row only this browser has is a new postcard that never reached the
   * server (or a save that failed while the API was down). A row the server
   * used to return and no longer does was deleted on another device.
   */
  const retainLocalOnlyIds = new Set(
    local.flatMap((row) => {
      if (!row.id || remoteIds.has(row.id)) return []
      if (localDirtyIds.has(row.id) || !isPostcardSynced(row.id)) return [row.id]
      return []
    }),
  )
  const merged = mergePostcardsLastWriteWins(
    local,
    remote,
    retainLocalOnlyIds,
    localDirtyIds,
  )
  const separated = separateDuplicatePostcardLocalIds(merged.nextLocal)
  const nextLocal = separated.rows
  const pushById = new Map<string, PostcardHydrated>()
  for (const row of merged.push) {
    if (row.id) pushById.set(row.id, row)
  }
  for (const row of separated.changed) {
    if (row.id) pushById.set(row.id, row)
  }
  const push = [...pushById.values()]
  const keptIds = new Set(nextLocal.map((row) => row.id))
  const pushIds = new Set(pushById.keys())

  for (const row of local) {
    if (!row.id || keptIds.has(row.id)) continue
    await postcardsAdapter.forgetLocal(row.id)
  }

  for (const row of nextLocal) {
    await postcardsAdapter.putLocal(row)
    if (row.id && !pushIds.has(row.id)) {
      discardPendingPostcardUpsert(row.id)
    }
  }

  for (const row of push) {
    enqueuePostcardUpsert(row)
  }

  await flushPendingV2Sync()

  return nextLocal.length
}
