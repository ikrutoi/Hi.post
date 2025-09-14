import type { RefObject } from 'react'
// import type { CropArea } from '../../domain/image/centeringMaxCrop'
import type { SizeCard } from '@features/layout/domain/types'

export const getCroppedImage = (
  img: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  sizeCard: SizeCard
): string | null => {
  if (
    typeof sizeCard.width === 'number' &&
    typeof sizeCard.height === 'number'
  ) {
    const canvas = document.createElement('canvas')
    canvas.width = sizeCard.width
    canvas.height = sizeCard.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(
      img,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      canvas.width,
      canvas.height
    )

    return canvas.toDataURL('image/png')
  }

  return null
}
