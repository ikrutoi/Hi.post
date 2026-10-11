import {
  normalizePostcardRecord,
} from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { mergePostcardsLastWriteWins } from '../../domain/mergePostcardsLastWriteWins'
import {
  discardPendingPostcardUpsert,
  enqueuePostcardUpsert,
  flushPendingV2Sync,
  isPostcardPendingDelete,
  isPostcardPendingUpsert,
  isPostcardSynced,
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
  const localDirtyIds = pendingPostcardUpsertIdsWithBody()
  const retainLocalOnlyIds = new Set(
    local.flatMap((row) => {
      if (!row.id) return []
      if (isPostcardPendingUpsert(row.id) || !isPostcardSynced(row.id)) {
        return [row.id]
      }
      return []
    }),
  )
  const { nextLocal, push } = mergePostcardsLastWriteWins(
    local,
    remote,
    retainLocalOnlyIds,
    localDirtyIds,
  )
  const keptIds = new Set(nextLocal.map((row) => row.id))
  const pushIds = new Set(push.flatMap((row) => (row.id ? [row.id] : [])))

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
