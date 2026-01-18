import { clampCropToImage, enforceAspectRatio } from './index'
import { roundTo } from '@shared/utils/layout'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { calculateCropQuality } from '../helpers'
import type { LayoutOrientation } from '@layout/domain/types'
import type {
  CropLayer,
  CropMeta,
  ImageLayer,
  QualityLevel,
  ImageMeta,
  WorkingConfig,
} from '../../domain/types'

export const applyBounds = (
  crop: CropLayer,
  imageLayer: ImageLayer,
  orientation: LayoutOrientation,
): CropLayer => {
  let bounded = crop
  if (imageLayer) {
    bounded = clampCropToImage(bounded, imageLayer)
    bounded = enforceAspectRatio(bounded, imageLayer, orientation)
  }
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
): CropLayer => {
  const isPortrait = orientation === 'portrait'
  const ar = isPortrait
    ? 1 / startCrop.meta.aspectRatio
    : startCrop.meta.aspectRatio

  const isLeft = corner === 'TL' || corner === 'BL'
  const isTop = corner === 'TL' || corner === 'TR'

  const maxFreeWidth = isLeft
    ? startCrop.x + startCrop.meta.width - imageLayer.left
    : imageLayer.left + imageLayer.meta.width - startCrop.x

  const maxFreeHeight = isTop
    ? startCrop.y + startCrop.meta.height - imageLayer.top
    : imageLayer.top + imageLayer.meta.height - startCrop.y

  const absoluteMaxWidth = Math.min(maxFreeWidth, maxFreeHeight * ar)
  const absoluteMaxHeight = Math.min(maxFreeHeight, maxFreeWidth / ar)

  let newWidth = startCrop.meta.width
  let newHeight = startCrop.meta.height

  if (isPortrait) {
    const deltaH = isTop ? -dy : dy
    newHeight = Math.max(
      // safeMinWidth / ar,
      Math.min(startCrop.meta.height + deltaH, absoluteMaxHeight),
    )
    newWidth = newHeight * ar
  } else {
    const deltaW = isLeft ? -dx : dx
    newWidth = Math.max(
      // safeMinWidth,
      Math.min(startCrop.meta.width + deltaW, absoluteMaxWidth),
    )
    newHeight = newWidth / ar
  }

  console.log('updateCrop-->>')
  const { quality, qualityProgress } = calculateCropQuality(
    { ...startCrop.meta, ...startCrop.meta, width: newWidth } as CropMeta,
    // { ...startCrop, meta: { ...startCrop.meta, width: newWidth } } as CropLayer,
    imageLayer,
    imageMeta,
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
      width: roundTo(newWidth, 2),
      height: roundTo(newHeight, 2),
      quality,
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

export const checkIsCropFull = (config: WorkingConfig): boolean => {
  const { image, card, crop } = config
  const isRotated = image.orientation === 90 || image.orientation === 270

  const currentVisualAR = isRotated
    ? roundTo(1 / image.meta.imageAspectRatio, 3)
    : image.meta.imageAspectRatio

  const targetAR =
    card.orientation === 'portrait'
      ? roundTo(1 / card.aspectRatio, 3)
      : card.aspectRatio

  let maxWidth = 0
  let maxHeight = 0

  if (currentVisualAR > targetAR) {
    maxHeight = image.meta.height
    maxWidth = roundTo(maxHeight * targetAR, 2)
  } else {
    maxWidth = image.meta.width
    maxHeight = roundTo(maxWidth / targetAR, 2)
  }

  const isFullWidth = Math.abs(crop.meta.width - maxWidth) < 2
  const isFullHeight = Math.abs(crop.meta.height - maxHeight) < 2

  return isFullWidth && isFullHeight
}
