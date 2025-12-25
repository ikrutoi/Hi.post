import type { ImageMeta } from '../../domain/types'

export const validateImageSize = (
  imageMeta: ImageMeta,
  requiredWidth: number,
  requiredHeight: number
): { needsCrop: boolean } => {
  if (!imageMeta.width || !imageMeta.height) {
    return { needsCrop: false }
  }
  return {
    needsCrop: !(
      imageMeta.width >= requiredWidth && imageMeta.height >= requiredHeight
    ),
  }
}
