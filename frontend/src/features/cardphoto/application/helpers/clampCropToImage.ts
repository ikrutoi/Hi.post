import type { CropLayer, ImageLayer } from '../../domain/types'

export function clampCropToImage(
  cropLayer: CropLayer,
  imageLayer: ImageLayer
): CropLayer {
  const clamped = { ...cropLayer }

  if (clamped.x < imageLayer.left) {
    clamped.x = imageLayer.left
  }

  const maxRight = imageLayer.left + imageLayer.meta.width
  if (clamped.x + clamped.meta.width > maxRight) {
    clamped.meta.width = maxRight - clamped.x
  }

  if (clamped.y < imageLayer.top) {
    clamped.y = imageLayer.top
  }

  const maxBottom = imageLayer.top + imageLayer.meta.height
  if (clamped.y + clamped.meta.height > maxBottom) {
    clamped.meta.height = maxBottom - clamped.y
  }

  return clamped
}
