import type { ImageMeta } from '@cardphoto/domain/types'

const isDeadBlobUrl = (u: string | null | undefined): boolean =>
  typeof u === 'string' && u.startsWith('blob:')

function collectMetaUrls(meta: ImageMeta): Array<string | undefined> {
  return [meta.url, meta.full?.url, meta.thumbnail?.url]
}

/** Bytes already in memory, or a durable http(s) URL (not a reload-stale blob:). */
export function imageMetaHasLiveDisplayUrl(
  meta: ImageMeta | null | undefined,
): boolean {
  if (!meta) return false
  if (meta.full?.blob instanceof Blob) return true
  if (meta.thumbnail?.blob instanceof Blob) return true
  return collectMetaUrls(meta).some(
    (u) => typeof u === 'string' && u.trim() !== '' && !isDeadBlobUrl(u),
  )
}

/** http(s) survives reload; blob: in persisted Redux is usually dead. */
export function isDurableImageUrl(u: string | null | undefined): boolean {
  return typeof u === 'string' && /^https?:\/\//i.test(u.trim())
}

export function pickCardphotoDisplaySrc(
  meta: ImageMeta | null | undefined,
  registryUrl?: string | null,
): string | null {
  const fromMeta = [meta?.url, meta?.full?.url, meta?.thumbnail?.url]
  const http = [...fromMeta, registryUrl].find((u) => isDurableImageUrl(u))
  if (http) return http.trim()

  /**
   * Prefer meta blob: over registry. After reload the registry often still
   * holds the stale blob: while session revive already wrote a fresh URL.
   */
  const metaBlob = fromMeta.find(
    (u) => typeof u === 'string' && u.startsWith('blob:') && u.trim() !== '',
  )
  if (metaBlob) return metaBlob.trim()

  const fromRegistry = registryUrl?.trim() ?? ''
  return fromRegistry !== '' ? fromRegistry : null
}

/** Template can appear in the list / badge: live bytes or a Laravel file id. */
export function imageMetaCanBecomeLive(meta: ImageMeta): boolean {
  if (imageMetaHasLiveDisplayUrl(meta)) return true
  return Boolean(meta.remoteFileId)
}
