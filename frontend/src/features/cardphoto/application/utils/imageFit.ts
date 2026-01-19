import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '@shared/utils/layout'
import { calculateCropQuality } from '../helpers'
import type {
  ImageMeta,
  ImageLayer,
  CropLayer,
  CardLayer,
  ImageOrientation,
} from '../../domain/types'

export function fitImageToCard(
  originalMeta: ImageMeta,
  card: CardLayer,
  orientation: ImageOrientation,
): ImageLayer {
  const isRotated = orientation === 90 || orientation === 270

  const logicalWidth = isRotated ? originalMeta.height : originalMeta.width
  const logicalHeight = isRotated ? originalMeta.width : originalMeta.height

  const scaleX = card.width / logicalWidth
  const scaleY = card.height / logicalHeight
  const scale = Math.min(scaleX, scaleY)

  const finalWidth = roundTo(logicalWidth * scale, 2)
  const finalHeight = roundTo(logicalHeight * scale, 2)

  const offsetX = roundTo((card.width - finalWidth) / 2, 2)
  const offsetY = roundTo((card.height - finalHeight) / 2, 2)

  return {
    meta: {
      ...originalMeta,
      width: finalWidth,
      height: finalHeight,
    },
    left: offsetX,
    top: offsetY,
    orientation,
  }
}

export function createInitialCropLayer(
  image: ImageLayer,
  card: CardLayer,
  originalImage: ImageMeta,
): CropLayer {
  const crop: CropLayer = {
    x: 0,
    y: 0,
    meta: {
      width: 0,
      height: 0,
      aspectRatio: card.aspectRatio,
      quality: 'low',
      qualityProgress: 0,
    },
    orientation: card.orientation,
  }
  const deltaAR = CARD_SCALE_CONFIG.deltaAspectRatio

  const isRotated = image.orientation === 90 || image.orientation === 270
  const currentVisualAR = isRotated
    ? roundTo(1 / image.meta.imageAspectRatio, 3)
    : roundTo(image.meta.imageAspectRatio, 3)
  const targetAR =
    card.orientation === 'landscape'
      ? card.aspectRatio
      : roundTo(1 / card.aspectRatio, 3)

  if (card.orientation === 'portrait') {
    if (currentVisualAR > targetAR) {
      let ratio = 1
      const deltaAspectRatio = currentVisualAR - targetAR

      if (deltaAspectRatio < targetAR * deltaAR) {
        ratio = 1 - deltaAR + roundTo(deltaAspectRatio / targetAR, 2)
      }

      crop.meta.height = roundTo(image.meta.height * ratio, 2)
      crop.meta.width = roundTo(
        (image.meta.height * ratio) / card.aspectRatio,
        2,
      )
      crop.x = roundTo(image.left + (image.meta.width - crop.meta.width) / 2, 2)
      crop.y = roundTo(
        image.top + (image.meta.height - crop.meta.height) / 2,
        2,
      )
    } else {
      let ratio = 1
      const deltaAspectRatio = targetAR - currentVisualAR
      if (deltaAspectRatio < targetAR * deltaAR) {
        ratio = 1 - deltaAR + roundTo(deltaAspectRatio / targetAR, 2)
      }

      crop.meta.width = image.meta.width * ratio
      crop.meta.height = roundTo((image.meta.width * ratio) / targetAR, 2)
      crop.x = roundTo(image.left + (image.meta.width - crop.meta.width) / 2, 2)
      crop.y = roundTo(
        image.top + (image.meta.height - crop.meta.height) / 2,
        2,
      )
    }
  } else {
    if (currentVisualAR > targetAR) {
      let ratio = 1
      const deltaAspectRatio = currentVisualAR - targetAR
      if (deltaAspectRatio < targetAR * deltaAR) {
        ratio = 1 - deltaAR + roundTo(deltaAspectRatio / targetAR, 2)
      }

      crop.meta.height = roundTo(image.meta.height * ratio, 2)
      crop.meta.width = roundTo(image.meta.height * ratio * targetAR, 2)
      crop.x = roundTo(image.left + (image.meta.width - crop.meta.width) / 2, 2)
      crop.y = roundTo(
        image.top + (image.meta.height - crop.meta.height) / 2,
        2,
      )
    } else {
      let ratio = 1
      const deltaAspectRatio = targetAR - currentVisualAR
      if (deltaAspectRatio < targetAR * deltaAR) {
        ratio = 1 - deltaAR + roundTo(deltaAspectRatio / targetAR, 2)
      }

      crop.meta.width = roundTo(image.meta.width * ratio, 2)
      crop.meta.height = roundTo((image.meta.width * ratio) / targetAR, 2)
      crop.x = roundTo(image.left + (image.meta.width - crop.meta.width) / 2, 2)
      crop.y = roundTo(
        image.top + (image.meta.height - crop.meta.height) / 2,
        2,
      )
    }
  }

  const qualityData = calculateCropQuality(
    crop.meta,
    image,
    originalImage,
    card.orientation,
  )

  crop.meta.quality = qualityData.quality
  crop.meta.qualityProgress = qualityData.qualityProgress

  return crop
}

export function createFullCropLayer(
  image: ImageLayer,
  card: CardLayer,
): CropLayer {
  const isRotated = image.orientation === 90 || image.orientation === 270

  const currentVisualAR = isRotated
    ? roundTo(1 / image.meta.imageAspectRatio, 3)
    : image.meta.imageAspectRatio

  const targetAR =
    card.orientation === 'portrait'
      ? roundTo(1 / card.aspectRatio, 2)
      : card.aspectRatio

  let finalWidth = 0
  let finalHeight = 0

  if (currentVisualAR > targetAR) {
    finalHeight = image.meta.height
    finalWidth = roundTo(finalHeight * targetAR, 2)
  } else {
    finalWidth = image.meta.width
    finalHeight = roundTo(finalWidth / targetAR, 2)
  }

  return {
    x: roundTo(image.left + (image.meta.width - finalWidth) / 2, 2),
    y: roundTo(image.top + (image.meta.height - finalHeight) / 2, 2),
    meta: {
      width: finalWidth,
      height: finalHeight,
      aspectRatio: card.aspectRatio,
      quality: 'low',
      qualityProgress: 0,
    },
    orientation: card.orientation,
  }
}
