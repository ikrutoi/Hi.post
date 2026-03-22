import { clampCropToImage, enforceAspectRatio } from './index'
import { roundTo } from '@shared/utils/layout'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { calculateCropQuality } from '../helpers'
import type { LayoutOrientation } from '@layout/domain/types'
import type {
  CropLayer,
  CropMeta,
  ImageLayer,
  ImageMeta,
  WorkingConfig,
} from '../../domain/types'

export const applyBounds = (
  crop: CropLayer,
  imageLayer: ImageLayer,
  orientation: LayoutOrientation,
): CropLayer => {
  if (!imageLayer) return crop

  const isRotated = imageLayer.rotation === 90 || imageLayer.rotation === 270

  const imgCenterX = imageLayer.left + imageLayer.meta.width / 2
  const imgCenterY = imageLayer.top + imageLayer.meta.height / 2

  const vWidth = isRotated ? imageLayer.meta.height : imageLayer.meta.width
  const vHeight = isRotated ? imageLayer.meta.width : imageLayer.meta.height

  const vLeft = imgCenterX - vWidth / 2
  const vTop = imgCenterY - vHeight / 2

  const visualImageLayer: ImageLayer = {
    ...imageLayer,
    left: vLeft,
    top: vTop,
    meta: {
      ...imageLayer.meta,
      width: vWidth,
      height: vHeight,
    },
  }

  let bounded = enforceAspectRatio(crop, visualImageLayer, orientation)

  bounded = clampCropToImage(bounded, visualImageLayer)

  return {
    ...bounded,
    x: roundTo(bounded.x, 2),
    y: roundTo(bounded.y, 2),
    meta: {
      ...bounded.meta,
      width: roundTo(bounded.meta.width, 2),
      height: roundTo(bounded.meta.height, 2),
    },
  }
}

export const updateCrop = (
  corner: 'TL' | 'TR' | 'BL' | 'BR',
  dx: number,
  dy: number,
  startCrop: CropLayer,
  imageLayer: ImageLayer,
  imageMeta: ImageMeta,
  orientation: LayoutOrientation,
  safeMinWidth: number,
): CropLayer => {
  const isRotated = imageLayer.rotation === 90 || imageLayer.rotation === 270

  const imgCenterX = imageLayer.left + imageLayer.meta.width / 2
  const imgCenterY = imageLayer.top + imageLayer.meta.height / 2
  const vWidth = isRotated ? imageLayer.meta.height : imageLayer.meta.width
  const vHeight = isRotated ? imageLayer.meta.width : imageLayer.meta.height
  const vLeft = imgCenterX - vWidth / 2
  const vTop = imgCenterY - vHeight / 2

  const ar = startCrop.meta.aspectRatio
  const isLeft = corner === 'TL' || corner === 'BL'
  const isTop = corner === 'TL' || corner === 'TR'

  const maxFreeWidth = isLeft
    ? startCrop.x + startCrop.meta.width - vLeft
    : vLeft + vWidth - startCrop.x

  const maxFreeHeight = isTop
    ? startCrop.y + startCrop.meta.height - vTop
    : vTop + vHeight - startCrop.y

  const absoluteMaxWidth = Math.min(maxFreeWidth, maxFreeHeight * ar)
  const absoluteMaxHeight = Math.min(maxFreeHeight, maxFreeWidth / ar)

  let newWidth = startCrop.meta.width
  let newHeight = startCrop.meta.height

  if (isRotated) {
    const deltaH = isTop ? -dy : dy
    newHeight = Math.max(
      safeMinWidth,
      Math.min(startCrop.meta.height + deltaH, absoluteMaxHeight),
    )
    newWidth = newHeight * ar
  } else {
    const deltaW = isLeft ? -dx : dx
    newWidth = Math.max(
      safeMinWidth,
      Math.min(startCrop.meta.width + deltaW, absoluteMaxWidth),
    )
    newHeight = newWidth / ar
  }

  const w = roundTo(newWidth, 2)
  const h = roundTo(newHeight, 2)

  const { qualityProgress } = calculateCropQuality(
    { ...startCrop.meta, width: w, height: h },
    imageLayer,
    imageMeta,
    orientation,
  )

  const startBottomY = startCrop.y + startCrop.meta.height
  const startRightX = startCrop.x + startCrop.meta.width

  const newX = isLeft ? startRightX - newWidth : startCrop.x
  const newY = isTop ? startBottomY - newHeight : startCrop.y

  return {
    ...startCrop,
    x: roundTo(newX, 2),
    y: roundTo(newY, 2),
    meta: {
      ...startCrop.meta,
      width: w,
      height: h,
      qualityProgress,
    },
  }
}

export const clampDragWithinImage = (
  start: CropLayer,
  dx: number,
  dy: number,
  imageLayer: ImageLayer,
): { x: number; y: number } => {
  let newX = start.x + dx
  let newY = start.y + dy

  newX = Math.max(
    imageLayer.left,
    Math.min(newX, imageLayer.left + imageLayer.meta.width - start.meta.width),
  )
  newY = Math.max(
    imageLayer.top,
    Math.min(newY, imageLayer.top + imageLayer.meta.height - start.meta.height),
  )

  return { x: newX, y: newY }
}

/**
 * Same geometry as `createFullCropLayer` + `applyBounds` (see handleCropFullAction).
 * Implemented here (not via import from imageFit) to avoid a helpers ↔ imageFit cycle.
 */
export const checkIsCropFull = (config: WorkingConfig): boolean => {
  const { image, card, crop } = config
  if (!crop) return false

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

  const rawFull: CropLayer = {
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

  const full = applyBounds(rawFull, image, card.orientation)
  const eps = 2

  return (
    Math.abs(crop.meta.width - full.meta.width) < eps &&
    Math.abs(crop.meta.height - full.meta.height) < eps
  )
}
