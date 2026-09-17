import { httpClient } from '@shared/api/httpClient'
import type {
  V2LibraryItem,
  V2LibraryKind,
} from '../domain/types/v2Library.types'

export const fetchV2LibraryApi = (kind: V2LibraryKind) =>
  httpClient.get<{ items: V2LibraryItem[] }>(`/api/v2/${kind}`)

export const upsertV2LibraryApi = (kind: V2LibraryKind, item: V2LibraryItem) =>
  httpClient.put<V2LibraryItem>(
    `/api/v2/${kind}/${encodeURIComponent(item.id)}`,
    item,
  )

export const deleteV2LibraryApi = (kind: V2LibraryKind, id: string) =>
  httpClient.delete(`/api/v2/${kind}/${encodeURIComponent(id)}`)
