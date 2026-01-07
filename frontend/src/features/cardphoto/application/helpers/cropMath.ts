import { clampCropToImage, enforceAspectRatio } from './index'
import { roundTo } from '@shared/utils/layout'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CropLayer, ImageLayer } from '../../domain/types'

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
    y: roundTo(bounded.y),
    meta: {
      ...bounded.meta,
      width: roundTo(bounded.meta.width),
      height: roundTo(bounded.meta.height),
    },
  }
}

export const updateCrop = (
  corner: 'TL' | 'TR' | 'BL' | 'BR',
  dx: number,
  dy: number,
  startCrop: CropLayer,
  imageLayer: ImageLayer,
  orientation: LayoutOrientation
): CropLayer => {
  const minWidth = 20
  const aspectRatio = startCrop.meta.aspectRatio

  let newWidth = startCrop.meta.width
  let newHeight = startCrop.meta.height
  let newX = startCrop.x
  let newY = startCrop.y

  switch (corner) {
    case 'BR':
      newWidth = startCrop.meta.width + dx
      newHeight = roundTo(newWidth / aspectRatio, 2)
      break
    case 'TR':
      newWidth = startCrop.meta.width + dx
      newHeight = roundTo(newWidth / aspectRatio, 2)
      newY = startCrop.y + dy
      break
    case 'BL':
      newWidth = startCrop.meta.width - dx
      newHeight = roundTo(newWidth / aspectRatio, 2)
      newX = startCrop.x + dx
      break
    case 'TL':
      newWidth = startCrop.meta.width - dx
      newHeight = roundTo(newWidth / aspectRatio, 2)
      newX = startCrop.x + dx
      newY = startCrop.y + dy
      break
  }

  newWidth = Math.max(newWidth, minWidth)
  newHeight = Math.max(newHeight, minWidth / aspectRatio)

  return applyBounds(
    {
      ...startCrop,
      x: newX,
      y: newY,
      meta: { ...startCrop.meta, width: newWidth, height: newHeight },
    },
    imageLayer,
    orientation
  )
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
