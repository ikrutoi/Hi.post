import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '@shared/utils/layout'
import type {
  ImageMeta,
  ImageLayer,
  CropLayer,
  CardLayer,
} from '../../domain/types'

export function fitImageToCard(meta: ImageMeta, card: CardLayer): ImageLayer {
  const scaleX = card.width / meta.width
  const scaleY = card.height / meta.height
  const scale = Math.min(scaleX, scaleY)

  const finalWidth = roundTo(meta.width * scale, 2)
  const finalHeight = roundTo(meta.height * scale, 2)
  const offsetX = roundTo((card.width - finalWidth) / 2, 2)
  const offsetY = roundTo((card.height - finalHeight) / 2, 2)

  const imageAspectRatio = roundTo(meta.width / meta.height, 2)

  return {
    meta: {
      ...meta,
      width: roundTo(finalWidth, 2),
      height: roundTo(finalHeight, 2),
      imageAspectRatio,
    },
    left: roundTo(offsetX, 2),
    top: roundTo(offsetY, 2),
    orientation: 0,
  }
}

export function createInitialCropLayer(
  image: ImageLayer,
  card: CardLayer
): CropLayer {
  const crop: CropLayer = {
    x: 0,
    y: 0,
    meta: { width: 0, height: 0, aspectRatio: card.aspectRatio },
    orientation: card.orientation,
  }

  const deltaAR = CARD_SCALE_CONFIG.deltaAspectRatio

  if (card.orientation === 'portrait') {
    const aspectRatioPortrait = roundTo(1 / card.aspectRatio, 3)

    if (image.meta.imageAspectRatio > aspectRatioPortrait) {
      let ratio = 1
      const deltaAspectRatio = image.meta.imageAspectRatio - aspectRatioPortrait

      if (deltaAspectRatio < aspectRatioPortrait * deltaAR) {
        ratio = 1 - deltaAR + roundTo(deltaAspectRatio / aspectRatioPortrait, 2)
      }

      crop.meta.height = image.meta.height * ratio
      crop.meta.width = roundTo(
        (image.meta.height * ratio) / card.aspectRatio,
        2
      )
      crop.x = roundTo((card.width - crop.meta.width) / 2, 2)
      crop.y = image.top + (image.meta.height - crop.meta.height) / 2
    } else {
      let ratio = 1
      const deltaAspectRatio = aspectRatioPortrait - image.meta.imageAspectRatio
      if (deltaAspectRatio < aspectRatioPortrait * deltaAR) {
        ratio = 1 - deltaAR + roundTo(deltaAspectRatio / aspectRatioPortrait, 2)
      }

      crop.meta.width = image.meta.width * ratio
      crop.meta.height = roundTo(image.meta.width * ratio * card.aspectRatio, 2)
      crop.x = image.left + (image.meta.width - crop.meta.width) / 2
      crop.y = roundTo((card.height - crop.meta.height) / 2, 2)
    }
  } else {
    if (image.meta.imageAspectRatio > card.aspectRatio) {
      let ratio = 1
      const deltaAspectRatio = image.meta.imageAspectRatio - card.aspectRatio
      if (deltaAspectRatio < card.aspectRatio * deltaAR) {
        ratio = 1 - deltaAR + roundTo(deltaAspectRatio / card.aspectRatio, 2)
      }

      crop.meta.height = image.meta.height * ratio
      crop.meta.width = roundTo(image.meta.height * ratio * card.aspectRatio, 2)
      crop.x = roundTo((card.width - crop.meta.width) / 2, 2)
      crop.y =
        ratio === 1
          ? image.top
          : image.top + (image.meta.height - crop.meta.height) / 2
    } else {
      let ratio = 1
      const deltaAspectRatio = card.aspectRatio - image.meta.imageAspectRatio
      if (deltaAspectRatio < card.aspectRatio * deltaAR) {
        ratio = 1 - deltaAR + roundTo(deltaAspectRatio / card.aspectRatio, 2)
      }

      crop.meta.width = image.meta.width * ratio
      crop.meta.height = roundTo(
        (image.meta.width * ratio) / card.aspectRatio,
        2
      )
      crop.x = image.left + (image.meta.width - crop.meta.width) / 2
      crop.y = roundTo((card.height - crop.meta.height) / 2, 2)
    }
  }

  return crop
}
