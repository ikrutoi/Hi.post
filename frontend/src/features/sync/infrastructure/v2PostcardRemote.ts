import {
  normalizePostcardRecord,
  type PostcardHydrated,
} from '@entities/postcard'
import { readAuthSession } from '@features/auth/infrastructure/sessionStorage'
import { isHttpAuthMode } from '@shared/config/authMode'
import { serializePostcardForV2 } from '../domain/serializePostcardForV2'
import {
  deleteV2PostcardApi,
  fetchV2PostcardsApi,
  upsertV2PostcardApi,
} from '../api/v2Postcard.api'

function isHttpAuthed(): boolean {
  return (
    isHttpAuthMode() &&
    Boolean(readAuthSession()?.token)
  )
}

export async function upsertV2Postcard(postcard: PostcardHydrated): Promise<void> {
  if (!isHttpAuthed()) return
  const sent = serializePostcardForV2(postcard)
  const first = await upsertV2PostcardApi(postcard.id, sent)
  const stored = normalizePostcardRecord(first.data)
  // Server keeps the row when its client timestamp is newer and still
  // responds 200. The edit never landed; send it again just ahead of that stamp.
  if ((stored.updatedAt ?? 0) <= (sent.updatedAt ?? 0)) return
  await upsertV2PostcardApi(postcard.id, {
    ...sent,
    updatedAt: (stored.updatedAt ?? 0) + 1,
  })
}

export async function deleteV2Postcard(id: string): Promise<void> {
  if (!isHttpAuthed() || !id) return
  await deleteV2PostcardApi(id)
}

export async function fetchV2Postcards(): Promise<PostcardHydrated[]> {
  if (!isHttpAuthed()) return []
  const response = await fetchV2PostcardsApi()
  return response.data.postcards ?? []
}
