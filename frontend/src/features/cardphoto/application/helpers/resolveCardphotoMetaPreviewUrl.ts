import type { ImageMeta } from '@cardphoto/domain/types'
import { hydrateMeta } from '@app/middleware/cardphotoHelpers'

/** URL для превью в CardPie / списке. */
export function resolveCardphotoMetaPreviewUrl(
  meta: ImageMeta | null | undefined,
): string | null {
  if (!meta) return null
  const hydrated = hydrateMeta(meta)
  const source = hydrated ?? meta
  const thumb = source.thumbnail?.url?.trim()
  if (thumb) return thumb
  const url = source.url?.trim()
  if (url) return url
  const full = source.full?.url?.trim()
  if (full) return full
  return null
}
