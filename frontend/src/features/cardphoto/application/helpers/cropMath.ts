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
  orientation: LayoutOrientation
): CropLayer => {
  const minWidth = 20
  const aspectRatio = startCrop.meta.aspectRatio

  let newWidth = startCrop.meta.width
  let newHeight = startCrop.meta.height

  const startBottomY = roundTo(startCrop.y + startCrop.meta.height, 2)
  const startRightX = roundTo(startCrop.x + startCrop.meta.width, 2)

  const isLeft = corner === 'TL' || corner === 'BL'
  const isTop = corner === 'TL' || corner === 'TR'

  const threshold = 0.5

  switch (corner) {
    case 'BR':
    case 'TR':
      if (orientation === 'portrait') {
        const deltaH = corner === 'TR' ? -dy : dy
        if (Math.abs(deltaH) > threshold) {
          newHeight = startCrop.meta.height + deltaH
          newWidth = roundTo(newHeight / aspectRatio, 2)
        }
      } else {
        if (Math.abs(dx) > threshold) {
          newWidth = startCrop.meta.width + dx
          newHeight = roundTo(newWidth / aspectRatio, 2)
        }
      }
      break

    case 'BL':
    case 'TL':
      if (orientation === 'portrait') {
        const deltaH = corner === 'TL' ? -dy : dy
        if (Math.abs(deltaH) > threshold) {
          newHeight = startCrop.meta.height + deltaH
          newWidth = roundTo(newHeight / aspectRatio, 2)
        }
      } else {
        if (Math.abs(dx) > threshold) {
          newWidth = startCrop.meta.width - dx
          newHeight = roundTo(newWidth / aspectRatio, 2)
        }
      }
      break
  }

  if (newWidth < minWidth) {
    newWidth = minWidth
    newHeight = roundTo(newWidth / aspectRatio, 2)
  }
  if (newHeight < minWidth / aspectRatio) {
    newHeight = roundTo(minWidth / aspectRatio, 2)
    newWidth = roundTo(newHeight * aspectRatio, 2)
  }

  let newX = isLeft ? roundTo(startRightX - newWidth, 2) : startCrop.x
  let newY = isTop ? roundTo(startBottomY - newHeight, 2) : startCrop.y

  return applyBounds(
    {
      ...startCrop,
      x: newX,
      y: newY,
      meta: {
        ...startCrop.meta,
        width: newWidth,
        height: newHeight,
      },
    },
    imageLayer,
    orientation
  )
}

export const updateCrop1 = (
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
      if (orientation === 'portrait') {
        newHeight = startCrop.meta.height + dy
        newWidth = roundTo(newHeight / aspectRatio, 2)
      } else {
        newWidth = startCrop.meta.width + dx
        newHeight = roundTo(newWidth / aspectRatio, 2)
      }
      break
    case 'TR':
      if (orientation === 'portrait') {
        newHeight = startCrop.meta.height + dy
        newWidth = roundTo(newHeight / aspectRatio, 2)
        newX = startCrop.x + dx
      } else {
        newWidth = startCrop.meta.width + dx
        newHeight = roundTo(newWidth / aspectRatio, 2)
        newY = startCrop.y + dy
      }
      break
    case 'BL':
      if (orientation === 'portrait') {
        newHeight = startCrop.meta.height - dy
        newWidth = roundTo(newHeight / aspectRatio, 2)
        newY = startCrop.y + dy
      } else {
        newWidth = startCrop.meta.width - dx
        newHeight = roundTo(newWidth / aspectRatio, 2)
        newX = startCrop.x + dx
      }
      break
    case 'TL':
      if (orientation === 'portrait') {
        newHeight = startCrop.meta.height - dy
        newWidth = roundTo(newHeight / aspectRatio, 2)
      } else {
        newWidth = startCrop.meta.width - dx
        newHeight = roundTo(newWidth / aspectRatio, 2)
      }
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
