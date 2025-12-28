import type { ImageData } from '../../domain/types'

export function clampCropToImage(
  crop: ImageData,
  imageData: ImageData
): ImageData {
  const clamped = { ...crop }

  if (clamped.left < imageData.left) {
    clamped.left = imageData.left
  }

  if (clamped.top < imageData.top) {
    clamped.top = imageData.top
  }

  const maxRight = imageData.left + imageData.width
  if (clamped.left + clamped.width > maxRight) {
    clamped.width = maxRight - clamped.left
  }

  const maxBottom = imageData.top + imageData.height
  if (clamped.top + clamped.height > maxBottom) {
    clamped.height = maxBottom - clamped.top
  }

  return clamped
}
