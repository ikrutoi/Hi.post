import { clampCropToImage, enforceAspectRatio } from './index'
import { roundTo } from '@shared/utils/layout'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type { LayoutOrientation } from '@layout/domain/types'
import type {
  CropLayer,
  ImageLayer,
  QualityLevel,
  ImageMeta,
} from '../../domain/types'

export const applyBounds = (
  crop: CropLayer,
  imageLayer: ImageLayer,
  orientation: LayoutOrientation
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
  orientation: LayoutOrientation
): CropLayer => {
  const isPortrait = orientation === 'portrait'
  const ar = isPortrait
    ? 1 / startCrop.meta.aspectRatio
    : startCrop.meta.aspectRatio
  const scale = imageMeta.width / Math.max(1, imageLayer.meta.width)

  const isLeft = corner === 'TL' || corner === 'BL'
  const isTop = corner === 'TL' || corner === 'TR'
  const minAllowedDpi = CARD_SCALE_CONFIG.minAllowedDpi
  const inches = CARD_SCALE_CONFIG.widthMm / 25.4
  const minRealPx = minAllowedDpi * inches

  const calculatedMinWidth = Math.round(minRealPx / scale)
  const safeMinWidth = Math.max(
    20,
    Math.min(calculatedMinWidth, imageLayer.meta.width * 0.9)
  )

  const minDPI = CARD_SCALE_CONFIG.minAllowedDpi
  const maxDPI = CARD_SCALE_CONFIG.maxAllowedDpi

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
      safeMinWidth / ar,
      Math.min(startCrop.meta.height + deltaH, absoluteMaxHeight)
    )
    newWidth = newHeight * ar
  } else {
    const deltaW = isLeft ? -dx : dx
    newWidth = Math.max(
      safeMinWidth,
      Math.min(startCrop.meta.width + deltaW, absoluteMaxWidth)
    )
    newHeight = newWidth / ar
  }

  const realCropWidthPx = newWidth * scale
  const dpi = Math.round(realCropWidthPx / inches)
  const quality: QualityLevel =
    dpi >= maxDPI ? 'high' : dpi >= 150 ? 'medium' : 'low'
  const progress = Math.max(
    0,
    Math.min(minDPI, ((dpi - minDPI) / (maxDPI - minDPI)) * 100)
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
      qualityProgress: progress,
    },
  }
}

export const clampDragWithinImage = (
  start: CropLayer,
  dx: number,
  dy: number,
  imageLayer: ImageLayer
): { x: number; y: number } => {
  let newX = start.x + dx
  let newY = start.y + dy

  newX = Math.max(
    imageLayer.left,
    Math.min(newX, imageLayer.left + imageLayer.meta.width - start.meta.width)
  )
  newY = Math.max(
    imageLayer.top,
    Math.min(newY, imageLayer.top + imageLayer.meta.height - start.meta.height)
  )

  return { x: newX, y: newY }
}
