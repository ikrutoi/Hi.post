import { CropLayer, QualityLevel } from '../../domain/types'

export const getCroppedImg = async (
  imageElement: HTMLImageElement,
  crop: CropLayer,
  squareThumbSize: number = 360,
): Promise<{ full: Blob; thumb: Blob }> => {
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
    crop.meta.height,
  )

  const fullBlob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), 'image/jpeg', 0.95),
  )

  canvas.width = squareThumbSize
  canvas.height = squareThumbSize

  const sourceSize = Math.min(crop.meta.width, crop.meta.height)
  const offsetX = (crop.meta.width - sourceSize) / 2
  const offsetY = (crop.meta.height - sourceSize) / 2

  ctx.drawImage(
    imageElement,
    crop.x + offsetX,
    crop.y + offsetY,
    sourceSize,
    sourceSize,
    0,
    0,
    squareThumbSize,
    squareThumbSize,
  )

  const thumbBlob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), 'image/jpeg', 0.85),
  )

  return { full: fullBlob, thumb: thumbBlob }
}

export const getCroppedImg1 = async (
  imageElement: HTMLImageElement,
  crop: CropLayer,
  thumbWidth: number,
): Promise<{ full: Blob; thumb: Blob; thumbHeight: number }> => {
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
    crop.meta.height,
  )

  const fullBlob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), 'image/jpeg', 0.95),
  )

  const thumbHeight = Math.round(thumbWidth / crop.meta.aspectRatio)
  canvas.width = thumbWidth
  canvas.height = thumbHeight

  ctx.drawImage(
    imageElement,
    crop.x,
    crop.y,
    crop.meta.width,
    crop.meta.height,
    0,
    0,
    thumbWidth,
    thumbHeight,
  )

  const thumbBlob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), 'image/jpeg', 0.8),
  )

  return { full: fullBlob, thumb: thumbBlob, thumbHeight }
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
  cardWidthMm: number,
): number => {
  const inches = cardWidthMm / 25.4
  return Math.round(cropWidthPx / inches)
}

export const getQualityLevel = (dpi: number): QualityLevel => {
  if (dpi >= 300) return 'high'
  if (dpi >= 150) return 'medium'
  return 'low'
}
