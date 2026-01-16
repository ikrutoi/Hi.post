import { CropLayer, QualityLevel } from '../../domain/types'

export const getCroppedImg = (
  imageElement: HTMLImageElement,
  crop: CropLayer,
  rotation: number = 0
): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('No 2d context')

  canvas.width = crop.meta.width
  canvas.height = crop.meta.height

  ctx.drawImage(
    imageElement,
    crop.x,
    crop.y,
    crop.meta.width,
    crop.meta.height,
    0,
    0,
    crop.meta.width,
    crop.meta.height
  )

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
      },
      'image/jpeg',
      1.0
    )
  })
}

export const loadAsyncImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export const calculateDPI = (
  cropWidthPx: number,
  cardWidthMm: number
): number => {
  const inches = cardWidthMm / 25.4
  return Math.round(cropWidthPx / inches)
}

export const getQualityLevel = (dpi: number): QualityLevel => {
  if (dpi >= 300) return 'high'
  if (dpi >= 150) return 'medium'
  return 'low'
}
