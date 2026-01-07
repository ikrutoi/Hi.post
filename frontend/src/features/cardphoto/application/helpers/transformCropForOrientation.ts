import { roundTo } from '@shared/utils/layout'
import { applyBounds } from '../helpers'
import type { CropLayer, CardLayer, ImageLayer } from '../../domain/types'

export function transformCropForOrientation(
  oldCrop: CropLayer,
  oldCard: CardLayer,
  newCard: CardLayer,
  imageLayer: ImageLayer
): CropLayer {
  const adjusted: CropLayer = {
    ...oldCrop,
    meta: { ...oldCrop.meta },
  }
  const aspectRatio = newCard.aspectRatio
  const orientation = newCard.orientation

  adjusted.orientation = orientation

  if (orientation === 'portrait') {
    adjusted.meta.height = imageLayer.meta.height
    adjusted.meta.width = roundTo(imageLayer.meta.height / aspectRatio, 2)
    adjusted.x = roundTo((imageLayer.meta.width - adjusted.meta.width) / 2, 2)
    adjusted.y = imageLayer.top
  } else {
    // adjusted.meta.width = Math.round(adjusted.meta.height * aspectRatio)
    // adjusted.x = Math.round((imageLayer.meta.width - adjusted.meta.width) / 2)
    // adjusted.y = imageLayer.top
  }

  return applyBounds(adjusted, imageLayer, orientation)
}
