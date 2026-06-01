/** Радиус углов области загружаемой картинки (px). */
export const AVATAR_STAGE_BORDER_RADIUS_PX = 4

/** Доля стороны кропа — радиус скругления углов (12%). */
export const AVATAR_CORNER_RADIUS_RATIO = 0.12

export type AvatarCropPixels = {
  x: number
  y: number
  size: number
}

export type AvatarStageLayout = {
  stageSide: number
  scale: number
  displayWidth: number
  displayHeight: number
  cropX: number
  cropY: number
  cropSize: number
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (url.startsWith('http://') || url.startsWith('https://')) {
      img.crossOrigin = 'anonymous'
    }
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = url
  })
}

export function getAvatarStageLayout(
  imageWidth: number,
  imageHeight: number,
  stageSide: number,
): AvatarStageLayout {
  const cropSize = stageSide
  const scale = Math.min(stageSide / imageWidth, stageSide / imageHeight)
  const displayWidth = imageWidth * scale
  const displayHeight = imageHeight * scale

  return {
    stageSide,
    scale,
    displayWidth,
    displayHeight,
    cropX: 0,
    cropY: 0,
    cropSize,
  }
}

export function getCenteredAvatarImagePosition(
  layout: AvatarStageLayout,
): { x: number; y: number } {
  return {
    x: (layout.stageSide - layout.displayWidth) / 2,
    y: (layout.stageSide - layout.displayHeight) / 2,
  }
}

export function getInitialAvatarCropState(
  imageWidth: number,
  imageHeight: number,
  stageSide: number,
): { position: { x: number; y: number }; layout: AvatarStageLayout } {
  const layout = getAvatarStageLayout(imageWidth, imageHeight, stageSide)

  return {
    position: getCenteredAvatarImagePosition(layout),
    layout,
  }
}

export function clampAvatarImagePosition(
  position: { x: number; y: number },
  layout: AvatarStageLayout,
): { x: number; y: number } {
  const { displayWidth, displayHeight, cropX, cropY, cropSize } = layout
  const minX = cropX + cropSize - displayWidth
  const maxX = cropX
  const minY = cropY + cropSize - displayHeight
  const maxY = cropY

  return {
    x: Math.min(maxX, Math.max(minX, position.x)),
    y: Math.min(maxY, Math.max(minY, position.y)),
  }
}

export function getAvatarCropPixels(
  imageWidth: number,
  imageHeight: number,
  layout: AvatarStageLayout,
  position: { x: number; y: number },
): AvatarCropPixels {
  const { scale, cropX, cropY, cropSize } = layout
  const srcX = (cropX - position.x) / scale
  const srcY = (cropY - position.y) / scale
  const srcSize = cropSize / scale

  return {
    x: srcX,
    y: srcY,
    size: srcSize,
  }
}

export async function cropAvatarToDataUrl(
  image: HTMLImageElement,
  crop: AvatarCropPixels,
  quality = 0.92,
): Promise<string> {
  const size = Math.round(crop.size)
  const radius = size * AVATAR_CORNER_RADIUS_RATIO
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Could not create canvas context')
  }

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size, size)

  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, radius)
  ctx.clip()

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.size,
    crop.size,
    0,
    0,
    size,
    size,
  )

  return canvas.toDataURL('image/jpeg', quality)
}
