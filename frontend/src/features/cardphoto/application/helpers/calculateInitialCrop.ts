import { CARD_SCALE_CONFIG } from '@shared/config/constants'

export function calculateInitialCrop(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number
) {
  let initialWidth = 0
  let initialHeight = 0
  let initialLeft = 0
  let initialTop = 0

  const useAspectRatio = Number(aspectRatio.toFixed(2))

  if (useAspectRatio === CARD_SCALE_CONFIG.aspectRatio) {
    initialWidth = Math.round(imageWidth * CARD_SCALE_CONFIG.scaleCrop)
    initialHeight = Math.round(initialWidth / CARD_SCALE_CONFIG.aspectRatio)
    initialLeft = Math.round((imageWidth - initialWidth) / 2)
    initialTop = Math.round((imageHeight - initialHeight) / 2)
  } else if (useAspectRatio < CARD_SCALE_CONFIG.aspectRatio) {
    initialWidth = Math.round(imageWidth)
    initialHeight = Math.round(initialWidth / CARD_SCALE_CONFIG.aspectRatio)
    initialLeft = 0
    initialTop = Math.round((imageHeight - initialHeight) / 2)
  } else {
    initialHeight = Math.round(imageHeight)
    initialWidth = Math.round(initialHeight * CARD_SCALE_CONFIG.aspectRatio)
    initialLeft = Math.round((imageWidth - initialWidth) / 2)
    initialTop = 0
  }

  return {
    left: initialLeft,
    top: initialTop,
    width: initialWidth,
    height: initialHeight,
  }
}
