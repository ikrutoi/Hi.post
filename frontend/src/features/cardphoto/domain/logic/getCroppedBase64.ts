import type { CropArea } from '../typesLayout/crop.types'

export const getCroppedBase64 = (
  img: HTMLImageElement,
  crop: CropArea,
  scaleX: number,
  scaleY: number
): string => {
  const canvas = document.createElement('canvas')
  canvas.width = crop.width
  canvas.height = crop.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  ctx.drawImage(
    img,
    crop.x / scaleX,
    crop.y / scaleY,
    crop.width / scaleX,
    crop.height / scaleY,
    0,
    0,
    crop.width,
    crop.height
  )

  return canvas.toDataURL('image/png')
}
