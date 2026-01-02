import { CARD_SCALE_CONFIG } from '@shared/config/constants'

export function calculateInitialCrop(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number,
  imageAspectRatio: number
) {
  let initialWidth = 0
  let initialHeight = 0

  if (imageAspectRatio === aspectRatio) {
    initialWidth = Math.round(imageWidth * CARD_SCALE_CONFIG.scaleCrop)
    initialHeight = Math.round(initialWidth / aspectRatio)
  } else if (imageAspectRatio < aspectRatio) {
    initialWidth = Math.round(imageWidth)
    initialHeight = Math.round(initialWidth / aspectRatio)
  } else {
    initialHeight = Math.round(imageHeight)
    initialWidth = Math.round(initialHeight * aspectRatio)
  }

  return {
    width: initialWidth,
    height: initialHeight,
    aspectRatio,
    x: Math.round((imageWidth - initialWidth) / 2),
    y: Math.round((imageHeight - initialHeight) / 2),
  }
}
