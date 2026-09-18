import {
  normalizePostcardRecord,
} from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { mergePostcardsLastWriteWins } from '../../domain/mergePostcardsLastWriteWins'
import { enqueuePostcardUpsert } from '../../infrastructure/postcardV2PendingSync'
import { fetchV2Postcards } from '../../infrastructure/v2PostcardRemote'

/**
 * Pull remote v2 rows, last-write-wins merge into IndexedDB, queue local winners.
 */
export async function pullV2PostcardsIntoIdb(): Promise<number> {
  const remote = (await fetchV2Postcards()).map(normalizePostcardRecord)
  const local = await postcardsAdapter.getAll()
  const { nextLocal, push } = mergePostcardsLastWriteWins(local, remote)

  for (const row of nextLocal) {
    await postcardsAdapter.putLocal(row)
  }

  for (const row of push) {
    enqueuePostcardUpsert(row)
  }

  return nextLocal.length
}
