import type { CropLayer, ImageLayer } from '../../domain/types'
import { clampCropToImage, enforceAspectRatio } from './index'

export const round0 = (v: number) => Number(v.toFixed(0))

export const applyBounds = (
  crop: CropLayer,
  imageLayer?: ImageLayer
): CropLayer => {
  let bounded = crop
  if (imageLayer) {
    bounded = clampCropToImage(bounded, imageLayer)
    bounded = enforceAspectRatio(bounded, imageLayer)
  }
  return {
    ...bounded,
    x: round0(bounded.x),
    y: round0(bounded.y),
    meta: {
      ...bounded.meta,
      width: round0(bounded.meta.width),
      height: round0(bounded.meta.height),
    },
  }
}

export const updateCrop = (
  corner: 'TL' | 'TR' | 'BL' | 'BR',
  dx: number,
  dy: number,
  startCrop: CropLayer,
  imageLayer?: ImageLayer,
  minWidth = 20
): CropLayer => {
  const aspectRatio = startCrop.meta.aspectRatio

  let newWidth = startCrop.meta.width
  let newHeight = startCrop.meta.height
  let newX = startCrop.x
  let newY = startCrop.y

  switch (corner) {
    case 'BR':
      newWidth = startCrop.meta.width + dx
      newHeight = round0(newWidth / aspectRatio)
      break
    case 'TR':
      newWidth = startCrop.meta.width + dx
      newHeight = round0(newWidth / aspectRatio)
      newY = startCrop.y + dy
      break
    case 'BL':
      newWidth = startCrop.meta.width - dx
      newHeight = round0(newWidth / aspectRatio)
      newX = startCrop.x + dx
      break
    case 'TL':
      newWidth = startCrop.meta.width - dx
      newHeight = round0(newWidth / aspectRatio)
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
    imageLayer
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
