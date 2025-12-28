import type { ImageData } from '../../domain/types'

export function enforceAspectRatio(
  crop: ImageData,
  aspectRatio: number,
  imageData: ImageData
): ImageData {
  const adjusted = { ...crop }

  const currentRatio = adjusted.width / adjusted.height
  if (Math.abs(currentRatio - aspectRatio) < 0.01) {
    return adjusted
  }

  adjusted.height = Math.round(adjusted.width / aspectRatio)

  const maxBottom = imageData.top + imageData.height
  if (adjusted.top + adjusted.height > maxBottom) {
    adjusted.height = maxBottom - adjusted.top
    adjusted.width = Math.round(adjusted.height * aspectRatio)
  }

  const maxRight = imageData.left + imageData.width
  if (adjusted.left + adjusted.width > maxRight) {
    adjusted.width = maxRight - adjusted.left
    adjusted.height = Math.round(adjusted.width / aspectRatio)
  }

  return adjusted
}
