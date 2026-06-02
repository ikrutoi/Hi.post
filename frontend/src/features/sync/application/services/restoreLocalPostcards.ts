import {
  normalizePostcardRecord,
  type PostcardHydrated,
} from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'

export async function restoreLocalPostcardsFromSnapshot(
  postcards: PostcardHydrated[],
): Promise<void> {
  await postcardsAdapter.clear()

  for (const raw of postcards) {
    const postcard = normalizePostcardRecord(raw)
    await postcardsAdapter.put(postcard)
  }
}
