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

  // Cardphoto uses square card sizes, so orientation does not change the fit math.
  // We still apply the crop bounds consistently via `applyBounds`.
  adjusted.orientation = orientation
  adjusted.meta.height = imageLayer.meta.height
  adjusted.meta.width = roundTo(imageLayer.meta.height / aspectRatio, 2)
  adjusted.x = roundTo((imageLayer.meta.width - adjusted.meta.width) / 2, 2)
  adjusted.y = imageLayer.top

  return applyBounds(adjusted, imageLayer, orientation)
}
