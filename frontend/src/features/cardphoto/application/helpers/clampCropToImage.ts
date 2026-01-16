import type { CropLayer, ImageLayer } from '../../domain/types'

export function clampCropToImage(
  crop: CropLayer,
  image: ImageLayer
): CropLayer {
  const result = { ...crop, meta: { ...crop.meta } }

  if (result.meta.width > image.meta.width) result.meta.width = image.meta.width
  if (result.meta.height > image.meta.height)
    result.meta.height = image.meta.height

  if (result.x < image.left) result.x = image.left
  if (result.y < image.top) result.y = image.top

  const maxRight = image.left + image.meta.width
  if (result.x + result.meta.width > maxRight) {
    result.x = maxRight - result.meta.width
  }

  if (result.x < image.left) {
    result.x = image.left
    result.meta.width = maxRight - result.x
  }

  const maxBottom = image.top + image.meta.height
  if (result.y + result.meta.height > maxBottom) {
    result.y = maxBottom - result.meta.height
  }
  if (result.y < image.top) {
    result.y = image.top
    result.meta.height = maxBottom - result.y
  }

  return result
}
