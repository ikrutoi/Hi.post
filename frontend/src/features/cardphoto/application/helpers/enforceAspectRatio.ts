import { roundTo } from '@shared/utils/layout'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CropLayer, ImageLayer } from '../../domain/types'

export function enforceAspectRatio1(
  crop: CropLayer,
  imageLayer: ImageLayer,
  _orientation: LayoutOrientation
): CropLayer {
  const adjusted: CropLayer = {
    ...crop,
    meta: { ...crop.meta },
  }
  const aspectRatio = adjusted.meta.aspectRatio

  const currentRatio = adjusted.meta.width / adjusted.meta.height
  if (Math.abs(currentRatio - aspectRatio) < 0.01) {
    return adjusted
  }

  const maxRight = imageLayer.left + imageLayer.meta.width
  const maxBottom = imageLayer.top + imageLayer.meta.height

  // Cardphoto always uses square card sizes, so orientation does not affect
  // aspect fit logic. We keep one unified path to simplify code.
  adjusted.meta.width = imageLayer.meta.width
  adjusted.meta.height = roundTo(imageLayer.meta.width / aspectRatio, 2)

  if (adjusted.y + adjusted.meta.height > maxBottom) {
    adjusted.meta.height = maxBottom - adjusted.y
    adjusted.meta.width = roundTo(adjusted.meta.height * aspectRatio, 2)
  }

  if (adjusted.x + adjusted.meta.width > maxRight) {
    adjusted.meta.width = maxRight - adjusted.x
    adjusted.meta.height = roundTo(adjusted.meta.width / aspectRatio, 2)
  }

  return adjusted
}

export function enforceAspectRatio(
  crop: CropLayer,
  imageLayer: ImageLayer,
  _orientation: LayoutOrientation
): CropLayer {
  const adjusted = { ...crop, meta: { ...crop.meta } }

  const targetRatio = adjusted.meta.aspectRatio

  const currentRatio = adjusted.meta.width / adjusted.meta.height
  if (Math.abs(currentRatio - targetRatio) < 0.001) {
    return adjusted
  }

  let newHeight = adjusted.meta.height
  let newWidth = newHeight * targetRatio

  if (newWidth > imageLayer.meta.width) {
    newWidth = imageLayer.meta.width
    newHeight = newWidth / targetRatio
  }

  if (newHeight > imageLayer.meta.height) {
    newHeight = imageLayer.meta.height
    newWidth = newHeight * targetRatio
  }

  adjusted.meta.width = roundTo(newWidth, 2)
  adjusted.meta.height = roundTo(newHeight, 2)

  return adjusted
}
