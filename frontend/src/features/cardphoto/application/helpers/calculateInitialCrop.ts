import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '@shared/utils/layout'

export function calculateInitialCrop(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number,
  imageAspectRatio: number,
) {
  let initialWidth = 0
  let initialHeight = 0

  if (imageAspectRatio === aspectRatio) {
    initialWidth = roundTo(imageWidth * 0.5, 3)
    initialHeight = roundTo(initialWidth / aspectRatio, 3)
  } else if (imageAspectRatio < aspectRatio) {
    initialWidth = roundTo(imageWidth, 3)
    initialHeight = roundTo(initialWidth / aspectRatio, 3)
  } else {
    initialHeight = roundTo(imageHeight, 3)
    initialWidth = roundTo(initialHeight * aspectRatio, 3)
  }

  return {
    width: initialWidth,
    height: initialHeight,
    aspectRatio,
    x: roundTo((imageWidth - initialWidth) / 2, 2),
    y: roundTo((imageHeight - initialHeight) / 2, 2),
  }
}
