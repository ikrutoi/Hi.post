import { httpClient } from '@shared/api/httpClient'
import type { PostcardHydrated } from '@entities/postcard'

export type V2PostcardListResponse = {
  postcards: PostcardHydrated[]
}

export const fetchV2PostcardsApi = () =>
  httpClient.get<V2PostcardListResponse>('/api/v2/postcards')

export const upsertV2PostcardApi = (id: string, postcard: PostcardHydrated) =>
  httpClient.put<PostcardHydrated>(
    `/api/v2/postcards/${encodeURIComponent(id)}`,
    postcard,
  )

export const deleteV2PostcardApi = (id: string) =>
  httpClient.delete(`/api/v2/postcards/${encodeURIComponent(id)}`)
