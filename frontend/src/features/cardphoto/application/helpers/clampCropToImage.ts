import type { CropArea, ImageData } from '../../domain/types'

export function clampCropToImage(
  crop: CropArea,
  imageData: ImageData
): CropArea {
  const clamped = { ...crop }

  if (clamped.x < imageData.left) {
    clamped.x = imageData.left
  }

  const maxRight = imageData.left + imageData.width
  if (clamped.x + clamped.width > maxRight) {
    clamped.width = maxRight - clamped.x
  }

  if (clamped.y < imageData.top) {
    clamped.y = imageData.top
  }

  const maxBottom = imageData.top + imageData.height
  if (clamped.y + clamped.height > maxBottom) {
    clamped.height = maxBottom - clamped.y
  }

  return clamped
}
