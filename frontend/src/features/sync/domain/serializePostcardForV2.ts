import {
  normalizePostcardRecord,
  type PostcardHydrated,
} from '@entities/postcard'

function jsonReplacer(key: string, value: unknown): unknown {
  if (key === 'blob') return undefined
  if (typeof value === 'string' && value.startsWith('blob:')) return ''
  return value
}

/** Drop IDB blobs / dead blob: URLs before PUT /v2/postcards. */
export function serializePostcardForV2(postcard: PostcardHydrated): PostcardHydrated {
  const raw = JSON.parse(JSON.stringify(postcard, jsonReplacer)) as unknown
  return normalizePostcardRecord(raw)
}
