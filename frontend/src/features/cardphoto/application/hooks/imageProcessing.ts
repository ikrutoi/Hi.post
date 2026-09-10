import type { CropLayer, ImageLayer } from '../../domain/types'

function normalizeRotation(rotation: number): number {
  return ((rotation % 360) + 360) % 360
}

function getVisualImageBounds(imageLayer: ImageLayer): {
  vLeft: number
  vTop: number
  vWidth: number
  vHeight: number
} {
  const rotation = normalizeRotation(imageLayer.rotation ?? 0)
  const isSide = rotation === 90 || rotation === 270
  const vWidth = isSide ? imageLayer.meta.height : imageLayer.meta.width
  const vHeight = isSide ? imageLayer.meta.width : imageLayer.meta.height
  const imgCenterX = imageLayer.left + imageLayer.meta.width / 2
  const imgCenterY = imageLayer.top + imageLayer.meta.height / 2

  return {
    vLeft: imgCenterX - vWidth / 2,
    vTop: imgCenterY - vHeight / 2,
    vWidth,
    vHeight,
  }
}

/** Same clockwise rotation as CSS `rotate(Ndeg)` on the editor preview. */
function renderRotatedNaturalImage(
  image: HTMLImageElement,
  rotation: number,
): HTMLCanvasElement {
  const rot = normalizeRotation(rotation)
  const w = image.naturalWidth
  const h = image.naturalHeight
  const canvas = document.createElement('canvas')

  if (rot === 90 || rot === 270) {
    canvas.width = h
    canvas.height = w
  } else {
    canvas.width = w
    canvas.height = h
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context')

  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate((rot * Math.PI) / 180)
  ctx.drawImage(image, -w / 2, -h / 2, w, h)

  return canvas
}

export const getCroppedImg = async (
  imageElement: HTMLImageElement,
  crop: CropLayer,
  imageLayer: ImageLayer,
  squareThumbSize: number = 360,
): Promise<{ full: Blob; thumb: Blob; outWidth: number; outHeight: number }> => {
  const rotation = normalizeRotation(imageLayer.rotation ?? 0)
  const { vLeft, vTop, vWidth, vHeight } = getVisualImageBounds(imageLayer)
  const relX = crop.x - vLeft
  const relY = crop.y - vTop

  const sourceCanvas =
    rotation === 0
      ? null
      : renderRotatedNaturalImage(imageElement, rotation)

  const sourceWidth = sourceCanvas?.width ?? imageElement.naturalWidth
  const sourceHeight = sourceCanvas?.height ?? imageElement.naturalHeight
  const scaleX = sourceWidth / vWidth
  const scaleY = sourceHeight / vHeight

  const srcX = relX * scaleX
  const srcY = relY * scaleY
  const srcW = crop.meta.width * scaleX
  const srcH = crop.meta.height * scaleY
  const outWidth = Math.max(1, Math.round(srcW))
  const outHeight = Math.max(1, Math.round(srcH))

  const canvas = document.createElement('canvas')
  canvas.width = outWidth
  canvas.height = outHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context')

  if (sourceCanvas) {
    ctx.drawImage(sourceCanvas, srcX, srcY, srcW, srcH, 0, 0, outWidth, outHeight)
  } else {
    ctx.drawImage(
      imageElement,
      srcX,
      srcY,
      srcW,
      srcH,
      0,
      0,
      outWidth,
      outHeight,
    )
  }

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
