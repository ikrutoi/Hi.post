export const V2_LIBRARY_KINDS = ['addresses', 'cardtexts', 'cardphotos'] as const

export type V2LibraryKind = (typeof V2_LIBRARY_KINDS)[number]

export type V2LibraryItem = {
  id: string
  updatedAt?: number
  timestamp?: number
  [key: string]: unknown
}

export function libraryItemUpdatedAt(row: V2LibraryItem): number {
  return row.updatedAt ?? row.timestamp ?? 0
}
