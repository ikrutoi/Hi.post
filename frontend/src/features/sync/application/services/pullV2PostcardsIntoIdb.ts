import {
  normalizePostcardRecord,
  type PostcardHydrated,
} from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { fetchV2Postcards } from '../infrastructure/v2PostcardRemote'

/** Pull /v2/postcards into IndexedDB without echoing PUT back to the server. */
export async function pullV2PostcardsIntoIdb(): Promise<number> {
  const rows = await fetchV2Postcards()
  for (const raw of rows) {
    const postcard = normalizePostcardRecord(raw)
    await postcardsAdapter.putLocal(postcard)
  }
  return rows.length
}
