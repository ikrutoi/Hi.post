import {
  normalizePostcardRecord,
} from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { mergePostcardsLastWriteWins } from '../../domain/mergePostcardsLastWriteWins'
import {
  enqueuePostcardUpsert,
  flushPendingV2Sync,
  pendingPostcardDeleteIds,
} from '../../infrastructure/postcardV2PendingSync'
import { fetchV2Postcards } from '../../infrastructure/v2PostcardRemote'

/**
 * Pull remote v2 rows, last-write-wins merge into IndexedDB, queue local winners.
 */
export async function pullV2PostcardsIntoIdb(): Promise<number> {
  await flushPendingV2Sync()
  const deletedIds = pendingPostcardDeleteIds()
  for (const id of deletedIds) {
    await postcardsAdapter.deleteById(id)
  }
  const remote = (await fetchV2Postcards())
    .map(normalizePostcardRecord)
    .filter((row) => !deletedIds.has(row.id))
  const local = (await postcardsAdapter.getAll()).filter(
    (row) => !deletedIds.has(row.id),
  )
  const { nextLocal, push } = mergePostcardsLastWriteWins(local, remote)

  for (const row of nextLocal) {
    await postcardsAdapter.putLocal(row)
  }

  for (const row of push) {
    enqueuePostcardUpsert(row)
  }

  return nextLocal.length
}
