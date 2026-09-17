import { readAuthSession } from '@features/auth/infrastructure/sessionStorage'
import {
  deleteV2LibraryApi,
  fetchV2LibraryApi,
  upsertV2LibraryApi,
} from '../api/v2Library.api'
import type {
  V2LibraryItem,
  V2LibraryKind,
} from '../domain/types/v2Library.types'

function isHttpAuthed(): boolean {
  return (
    import.meta.env.VITE_AUTH_MODE === 'http' &&
    Boolean(readAuthSession()?.token)
  )
}

function jsonReplacer(key: string, value: unknown): unknown {
  if (key === 'blob') return undefined
  if (typeof value === 'string' && value.startsWith('blob:')) return ''
  return value
}

export function serializeLibraryItem(item: V2LibraryItem): V2LibraryItem {
  return JSON.parse(JSON.stringify(item, jsonReplacer)) as V2LibraryItem
}

export async function upsertV2LibraryItem(
  kind: V2LibraryKind,
  item: V2LibraryItem,
): Promise<void> {
  if (!isHttpAuthed() || !item.id) return
  await upsertV2LibraryApi(kind, {
    ...serializeLibraryItem(item),
    updatedAt: item.updatedAt ?? item.timestamp ?? Date.now(),
  })
}

export async function deleteV2LibraryItem(
  kind: V2LibraryKind,
  id: string,
): Promise<void> {
  if (!isHttpAuthed() || !id) return
  await deleteV2LibraryApi(kind, id)
}

export async function fetchV2Library(
  kind: V2LibraryKind,
): Promise<V2LibraryItem[]> {
  if (!isHttpAuthed()) return []
  const response = await fetchV2LibraryApi(kind)
  return response.data.items ?? []
}
