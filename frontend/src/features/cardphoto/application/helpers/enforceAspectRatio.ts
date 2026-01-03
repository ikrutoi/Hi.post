import type { CropLayer, ImageLayer } from '../../domain/types'

export function enforceAspectRatio(
  crop: CropLayer,
  imageLayer: ImageLayer
): CropLayer {
  const adjusted = { ...crop }
  const aspectRatio = adjusted.meta.aspectRatio

  const currentRatio = adjusted.meta.width / adjusted.meta.height
  if (Math.abs(currentRatio - aspectRatio) < 0.01) {
    return adjusted
  }

  adjusted.meta.height = Math.round(adjusted.meta.width / aspectRatio)

  const maxBottom = imageLayer.top + imageLayer.meta.height
  if (adjusted.y + adjusted.meta.height > maxBottom) {
    adjusted.meta.height = maxBottom - adjusted.y
    adjusted.meta.width = Math.round(adjusted.meta.height * aspectRatio)
  }

  const maxRight = imageLayer.left + imageLayer.meta.width
  if (adjusted.x + adjusted.meta.width > maxRight) {
    adjusted.meta.width = maxRight - adjusted.x
    adjusted.meta.height = Math.round(adjusted.meta.width / aspectRatio)
  }

  return adjusted
}
