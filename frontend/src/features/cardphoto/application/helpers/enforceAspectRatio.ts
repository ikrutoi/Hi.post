import type { CropArea, ImageData } from '../../domain/types'

export function enforceAspectRatio(
  crop: CropArea,
  aspectRatio: number,
  imageData: ImageData
): CropArea {
  const adjusted = { ...crop }

  const currentRatio = adjusted.width / adjusted.height
  if (Math.abs(currentRatio - aspectRatio) < 0.01) {
    return adjusted
  }

  adjusted.height = Math.round(adjusted.width / aspectRatio)

  const maxBottom = imageData.top + imageData.height
  if (adjusted.y + adjusted.height > maxBottom) {
    adjusted.height = maxBottom - adjusted.y
    adjusted.width = Math.round(adjusted.height * aspectRatio)
  }

  const maxRight = imageData.left + imageData.width
  if (adjusted.x + adjusted.width > maxRight) {
    adjusted.width = maxRight - adjusted.x
    adjusted.height = Math.round(adjusted.width / aspectRatio)
  }

  return adjusted
}
