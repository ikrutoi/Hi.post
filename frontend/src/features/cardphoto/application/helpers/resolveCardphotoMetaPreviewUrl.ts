import type { ImageMeta } from '@cardphoto/domain/types'
import { hydrateMeta } from '@app/middleware/cardphotoHelpers'

/** URL для превью в CardPie / списке. */
export function resolveCardphotoMetaPreviewUrl(
  meta: ImageMeta | null | undefined,
): string | null {
  if (!meta) return null
  const hydrated = hydrateMeta(meta)
  if (!hydrated) return null
  const thumb = hydrated.thumbnail?.url?.trim()
  if (thumb) return thumb
  const url = hydrated.url?.trim()
  if (url) return url
  const full = hydrated.full?.url?.trim()
  if (full) return full
  return null
}
