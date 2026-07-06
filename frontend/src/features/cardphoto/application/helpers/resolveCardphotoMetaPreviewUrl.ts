import type { ImageMeta } from '@cardphoto/domain/types'

/** URL для превью в CardPie / списке — без blob (только персистентные ссылки). */
export function resolveCardphotoMetaPreviewUrl(
  meta: ImageMeta | null | undefined,
): string | null {
  if (!meta) return null
  const thumb = meta.thumbnail?.url?.trim()
  if (thumb) return thumb
  const url = meta.url?.trim()
  if (url) return url
  const full = meta.full?.url?.trim()
  if (full) return full
  return null
}
