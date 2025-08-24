import type { CropRect, SizeCard } from '../../domain/model/types'

export const getCroppedImage = async (
  imageUrl: string,
  crop: CropRect,
  sizeCard: SizeCard,
  scaleX: number,
  scaleY: number
): Promise<string> => {
  const canvas = document.createElement('canvas')
  canvas.width = sizeCard.width
  canvas.height = sizeCard.height

  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = imageUrl

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Failed to load image'))
  })

  ctx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    sizeCard.width,
    sizeCard.height
  )

  return canvas.toDataURL('image/png')
}
