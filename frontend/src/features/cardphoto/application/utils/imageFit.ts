import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '@shared/utils/layout'
import { calculateCropQuality } from '../helpers'
import type {
  ImageMeta,
  ImageLayer,
  CropLayer,
  CardLayer,
  ImageRotation,
} from '../../domain/types'

/** Целые px + центрирование через floor — убирает субпиксельный зазор у бордера (589×588.406 → 589×589 при квадратной карте). */
function alignImageLayerToPixelGrid(
  card: CardLayer,
  imgWidth: number,
  imgHeight: number,
): { imgWidth: number; imgHeight: number; offsetX: number; offsetY: number } {
  const cw = Math.max(1, Math.round(card.width))
  const ch = Math.max(1, Math.round(card.height))
  let iw = Math.max(1, Math.round(imgWidth))
  let ih = Math.max(1, Math.round(imgHeight))

  iw = Math.min(iw, cw)
  ih = Math.min(ih, ch)

  // Один пиксель «letterbox»: при полном заполнении по одной оси добиваем вторую до ch/cw (микроискажение AR).
  if (iw === cw && ih === ch - 1) {
    ih = ch
  } else if (ih === ch && iw === cw - 1) {
    iw = cw
  }

  return {
    imgWidth: iw,
    imgHeight: ih,
    offsetX: Math.floor((cw - iw) / 2),
    offsetY: Math.floor((ch - ih) / 2),
  }
}

export function fitImageToCard(
  originalMeta: ImageMeta,
  card: CardLayer,
  rotation: ImageRotation,
  isCropped: boolean,
): ImageLayer {
  const isRotated = rotation === 90 || rotation === 270

  const targetWidth = isRotated ? originalMeta.height : originalMeta.width
  const targetHeight = isRotated ? originalMeta.width : originalMeta.height

  const scaleW = card.width / targetWidth
  const scaleH = card.height / targetHeight
  const scale = Math.min(scaleW, scaleH)

  let imgWidth = roundTo(originalMeta.width * scale, 2)
  let imgHeight = roundTo(originalMeta.height * scale, 2)

  // Snap to exact card edge when that axis is the limiting constraint.
  // Otherwise float + roundTo(..., 2) can leave a 1px gap at the bottom (or top) vs .cardphotoViewContent border.
  if (!isRotated) {
    const eps = 1e-4
    if (Math.abs(scale - scaleW) < eps) {
      imgWidth = roundTo(card.width, 2)
      imgHeight = roundTo(
        originalMeta.height * (imgWidth / originalMeta.width),
        2,
      )
    } else if (Math.abs(scale - scaleH) < eps) {
      imgHeight = roundTo(card.height, 2)
      imgWidth = roundTo(
        originalMeta.width * (imgHeight / originalMeta.height),
        2,
      )
    }
  }

  const { imgWidth: pxW, imgHeight: pxH, offsetX, offsetY } =
    alignImageLayerToPixelGrid(card, imgWidth, imgHeight)

  return {
    meta: {
      ...originalMeta,
      width: pxW,
      height: pxH,
      isCropped,
      orientation: card.orientation,
    },
    left: offsetX,
    top: offsetY,
    rotation,
  }
}

export function createInitialCropLayer(
  image: ImageLayer,
  card: CardLayer,
  originalImage: ImageMeta,
): CropLayer {
  const isRotated = image.rotation === 90 || image.rotation === 270

  const vWidth = isRotated ? image.meta.height : image.meta.width
  const vHeight = isRotated ? image.meta.width : image.meta.height
  const vCenterX = image.left + image.meta.width / 2
  const vCenterY = image.top + image.meta.height / 2

  const crop: CropLayer = {
    x: 0,
    y: 0,
    meta: {
      width: 0,
      height: 0,
      aspectRatio: card.aspectRatio,
      qualityProgress: 0,
    },
    orientation: card.orientation,
  }

  const deltaAR = CARD_SCALE_CONFIG.deltaAspectRatio
  const currentVisualAR = vWidth / vHeight
  const targetAR = card.aspectRatio

  if (currentVisualAR > targetAR) {
    let ratio = 1
    const deltaAspectRatio = currentVisualAR - targetAR
    if (deltaAspectRatio < targetAR * deltaAR) {
      ratio = 1 - deltaAR + roundTo(deltaAspectRatio / targetAR, 2)
    }

    crop.meta.height = roundTo(vHeight * ratio, 2)
    crop.meta.width = roundTo(crop.meta.height * targetAR, 2)
  } else {
    let ratio = 1
    const deltaAspectRatio = targetAR - currentVisualAR
    if (deltaAspectRatio < targetAR * deltaAR) {
      ratio = 1 - deltaAR + roundTo(deltaAspectRatio / targetAR, 2)
    }

    crop.meta.width = roundTo(vWidth * ratio, 2)
    crop.meta.height = roundTo(crop.meta.width / targetAR, 2)
  }

  crop.x = roundTo(vCenterX - crop.meta.width / 2, 2)
  crop.y = roundTo(vCenterY - crop.meta.height / 2, 2)

  const qualityData = calculateCropQuality(
    crop.meta,
    image,
    originalImage,
    card.orientation,
  )

  crop.meta.qualityProgress = qualityData.qualityProgress

  return crop
}

export function createFullCropLayer(
  image: ImageLayer,
  card: CardLayer,
): CropLayer {
  const isRotated = image.rotation === 90 || image.rotation === 270

  const vWidth = isRotated ? image.meta.height : image.meta.width
  const vHeight = isRotated ? image.meta.width : image.meta.height

  const currentVisualAR = vWidth / vHeight
  const targetAR = card.aspectRatio

  let finalWidth = 0
  let finalHeight = 0

  if (currentVisualAR > targetAR) {
    finalHeight = vHeight
    finalWidth = roundTo(finalHeight * targetAR, 2)
  } else {
    finalWidth = vWidth
    finalHeight = roundTo(finalWidth / targetAR, 2)
  }

  const visualCenterX = image.left + image.meta.width / 2
  const visualCenterY = image.top + image.meta.height / 2

  const x = roundTo(visualCenterX - finalWidth / 2, 2)
  const y = roundTo(visualCenterY - finalHeight / 2, 2)

  return {
    x,
    y,
    meta: {
      width: finalWidth,
      height: finalHeight,
      aspectRatio: card.aspectRatio,
      qualityProgress: 0,
    },
    orientation: card.orientation,
  }
}
