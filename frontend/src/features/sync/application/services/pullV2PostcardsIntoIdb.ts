import {
  normalizePostcardRecord,
} from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { mergePostcardsLastWriteWins } from '../../domain/mergePostcardsLastWriteWins'
import {
  enqueuePostcardUpsert,
  flushPendingV2Sync,
  isPostcardPendingDelete,
  isPostcardPendingUpsert,
  isPostcardSynced,
  rememberSyncedPostcardIds,
} from '../../infrastructure/postcardV2PendingSync'
import { fetchV2Postcards } from '../../infrastructure/v2PostcardRemote'

/**
 * Pull remote v2 rows, last-write-wins merge into IndexedDB, queue local winners.
 */
export async function pullV2PostcardsIntoIdb(): Promise<number> {
  await flushPendingV2Sync()
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
  )
  const keptIds = new Set(nextLocal.map((row) => row.id))

  for (const row of local) {
    if (!row.id || keptIds.has(row.id)) continue
    await postcardsAdapter.forgetLocal(row.id)
  }

  for (const row of nextLocal) {
    await postcardsAdapter.putLocal(row)
  }

  for (const row of push) {
    enqueuePostcardUpsert(row)
  }

  return nextLocal.length
}
