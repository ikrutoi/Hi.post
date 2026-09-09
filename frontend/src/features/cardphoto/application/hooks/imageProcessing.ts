import {
  cropHoleInImageSpace,
  resolveNaturalCropOutputSize,
} from '../helpers/cropMath'
import type { CropLayer, ImageLayer } from '../../domain/types'

function drawUprightCrop(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  srcX: number,
  srcY: number,
  srcW: number,
  srcH: number,
  rotation: number,
  outW: number,
  outH: number,
): void {
  const rot = ((rotation % 360) + 360) % 360

  ctx.save()
  ctx.translate(outW / 2, outH / 2)

  switch (rot) {
    case 90:
      ctx.rotate(-Math.PI / 2)
      ctx.drawImage(
        image,
        srcX,
        srcY,
        srcW,
        srcH,
        -outH / 2,
        -outW / 2,
        outH,
        outW,
      )
      break
    case 180:
      ctx.rotate(Math.PI)
      ctx.drawImage(
        image,
        srcX,
        srcY,
        srcW,
        srcH,
        -outW / 2,
        -outH / 2,
        outW,
        outH,
      )
      break
    case 270:
      ctx.rotate(Math.PI / 2)
      ctx.drawImage(
        image,
        srcX,
        srcY,
        srcW,
        srcH,
        -outH / 2,
        -outW / 2,
        outH,
        outW,
      )
      break
    default:
      ctx.drawImage(
        image,
        srcX,
        srcY,
        srcW,
        srcH,
        -outW / 2,
        -outH / 2,
        outW,
        outH,
      )
      break
  }

  ctx.restore()
}

export const getCroppedImg = async (
  imageElement: HTMLImageElement,
  crop: CropLayer,
  imageLayer: ImageLayer,
  squareThumbSize: number = 360,
): Promise<{ full: Blob; thumb: Blob; outWidth: number; outHeight: number }> => {
  const hole = cropHoleInImageSpace(crop, imageLayer)
  const scaleX = imageElement.naturalWidth / imageLayer.meta.width
  const scaleY = imageElement.naturalHeight / imageLayer.meta.height
  const srcX = hole.left * scaleX
  const srcY = hole.top * scaleY
  const srcW = hole.width * scaleX
  const srcH = hole.height * scaleY

  const { outWidth, outHeight } = resolveNaturalCropOutputSize(
    crop,
    imageLayer,
    imageElement.naturalWidth,
    imageElement.naturalHeight,
  )

  const canvas = document.createElement('canvas')
  canvas.width = outWidth
  canvas.height = outHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context')

  drawUprightCrop(
    ctx,
    imageElement,
    srcX,
    srcY,
    srcW,
    srcH,
    imageLayer.rotation,
    outWidth,
    outHeight,
  )

  const fullBlob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), 'image/jpeg', 0.95),
  )

  const thumbCanvas = document.createElement('canvas')
  thumbCanvas.width = squareThumbSize
  thumbCanvas.height = squareThumbSize
  const thumbCtx = thumbCanvas.getContext('2d')
  if (!thumbCtx) throw new Error('No 2d context')

  const sourceSize = Math.min(outWidth, outHeight)
  const offsetX = (outWidth - sourceSize) / 2
  const offsetY = (outHeight - sourceSize) / 2

  thumbCtx.drawImage(
    canvas,
    offsetX,
    offsetY,
    sourceSize,
    sourceSize,
    0,
    0,
    squareThumbSize,
    squareThumbSize,
  )

  const thumbBlob = await new Promise<Blob>((res) =>
    thumbCanvas.toBlob((b) => res(b!), 'image/jpeg', 0.85),
  )

  return {
    full: fullBlob,
    thumb: thumbBlob,
    outWidth,
    outHeight,
  }
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
    // `crossOrigin = 'anonymous'` on blob:/data: URLs breaks loading in several browsers → cropCheck silently fails.
    if (url.startsWith('http://') || url.startsWith('https://')) {
      img.crossOrigin = 'anonymous'
    }
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
