import type { CropLayer } from '../../domain/types'

export const getCroppedBase64 = (
  img: HTMLImageElement,
  crop: CropLayer,
  imageData: { width: number; height: number }
): string => {
  const scaleX = img.naturalWidth / imageData.width
  const scaleY = img.naturalHeight / imageData.height

  const canvas = document.createElement('canvas')
  canvas.width = crop.meta.width
  canvas.height = crop.meta.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  ctx.drawImage(
    img,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.meta.width * scaleX,
    crop.meta.height * scaleY,
    0,
    0,
    crop.meta.width,
    crop.meta.height
  )

  return canvas.toDataURL('image/png')
}
