import type { PostcardHydrated } from '@entities/postcard'
import { readAuthSession } from '@features/auth/infrastructure/sessionStorage'
import { serializePostcardForV2 } from '../domain/serializePostcardForV2'
import {
  deleteV2PostcardApi,
  fetchV2PostcardsApi,
  upsertV2PostcardApi,
} from '../api/v2Postcard.api'

function isHttpAuthed(): boolean {
  return (
    import.meta.env.VITE_AUTH_MODE === 'http' &&
    Boolean(readAuthSession()?.token)
  )
}

export async function upsertV2Postcard(postcard: PostcardHydrated): Promise<void> {
  if (!isHttpAuthed()) return
  await upsertV2PostcardApi(postcard.id, serializePostcardForV2(postcard))
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
