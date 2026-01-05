import { CARD_SCALE_CONFIG } from '@shared/config/constants'
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

  const finalWidth = meta.width * scale
  const finalHeight = meta.height * scale
  const offsetX = (card.width - finalWidth) / 2
  const offsetY = (card.height - finalHeight) / 2

  return {
    meta: {
      ...meta,
      width: Number(finalWidth.toFixed(2)),
      height: Number(finalHeight.toFixed(2)),
      imageAspectRatio: meta.width / meta.height,
    },
    left: Number(offsetX.toFixed(2)),
    top: Number(offsetY.toFixed(2)),
    orientation: 0,
  }
}

export function createInitialCropLayer(
  image: ImageLayer,
  card: CardLayer
): CropLayer {
  const targetAR = CARD_SCALE_CONFIG.aspectRatio
  const imgW = image.meta.width
  const imgH = image.meta.height

  let cropW = imgW * 0.9
  let cropH = cropW / targetAR

  if (cropH > imgH) {
    cropH = imgH * 0.9
    cropW = cropH * targetAR
  }

  const x = image.left + (imgW - cropW) / 2
  const y = image.top + (imgH - cropH) / 2

  return {
    x: Number(x.toFixed(2)),
    y: Number(y.toFixed(2)),
    meta: {
      width: Number(cropW.toFixed(2)),
      height: Number(cropH.toFixed(2)),
      aspectRatio: targetAR,
    },
    orientation: card.orientation,
  }
}
