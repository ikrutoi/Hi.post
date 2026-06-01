/** Радиус углов области загружаемой картинки (px). */
export const AVATAR_STAGE_BORDER_RADIUS_PX = 4

/** Доля узкой стороны исходника — сторона квадрата кропа. */
export const AVATAR_CROP_SOURCE_SIDE_RATIO = 0.85

/** Доля размера кропа — отображение готовой аватарки в превью. */
export const AVATAR_PREVIEW_DISPLAY_RATIO = 0.85

/** Доля стороны кропа в UI — радиус скругления углов (8%). */
export const AVATAR_CROP_CORNER_RADIUS_RATIO = 0.08

/** Доля стороны экспорта аватара — радиус скругления углов (12%). */
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

export function getAvatarSourceCropSize(
  imageWidth: number,
  imageHeight: number,
): number {
  return (
    Math.min(imageWidth, imageHeight) * AVATAR_CROP_SOURCE_SIDE_RATIO
  )
}

export function getAvatarStageLayout(
  imageWidth: number,
  imageHeight: number,
  stageSide: number,
): AvatarStageLayout {
  const scale = Math.min(stageSide / imageWidth, stageSide / imageHeight)
  const displayWidth = imageWidth * scale
  const displayHeight = imageHeight * scale
  const cropSize = getAvatarSourceCropSize(imageWidth, imageHeight) * scale
  const cropX = (stageSide - cropSize) / 2
  const cropY = (stageSide - cropSize) / 2

  return {
    stageSide,
    scale,
    displayWidth,
    displayHeight,
    cropX,
    cropY,
    cropSize,
  }
}

export function getStageCenteredAvatarImagePosition(
  layout: AvatarStageLayout,
): { x: number; y: number } {
  return {
    x: (layout.stageSide - layout.displayWidth) / 2,
    y: (layout.stageSide - layout.displayHeight) / 2,
  }
}

export function getInitialAvatarCropPosition(
  layout: AvatarStageLayout,
): { x: number; y: number } {
  return { x: layout.cropX, y: layout.cropY }
}

export function getAvatarPreviewDisplayLayout(layout: AvatarStageLayout): {
  size: number
  x: number
  y: number
} {
  const size = layout.cropSize * AVATAR_PREVIEW_DISPLAY_RATIO
  return {
    size,
    x: (layout.stageSide - size) / 2,
    y: (layout.stageSide - size) / 2,
  }
}

export function getInitialAvatarCropState(
  imageWidth: number,
  imageHeight: number,
  stageSide: number,
): {
  position: { x: number; y: number }
  cropPosition: { x: number; y: number }
  layout: AvatarStageLayout
} {
  const layout = getAvatarStageLayout(imageWidth, imageHeight, stageSide)

  return {
    position: getStageCenteredAvatarImagePosition(layout),
    cropPosition: getInitialAvatarCropPosition(layout),
    layout,
  }
}

export function clampAvatarCropPosition(
  cropPosition: { x: number; y: number },
  layout: AvatarStageLayout,
  imagePosition: { x: number; y: number },
): { x: number; y: number } {
  const { stageSide, cropSize, displayWidth, displayHeight } = layout
  const minX = Math.max(0, imagePosition.x)
  const maxX = Math.min(stageSide - cropSize, imagePosition.x + displayWidth - cropSize)
  const minY = Math.max(0, imagePosition.y)
  const maxY = Math.min(
    stageSide - cropSize,
    imagePosition.y + displayHeight - cropSize,
  )

  const clampAxis = (value: number, min: number, max: number) => {
    if (max < min) {
      return (min + max) / 2
    }
    return Math.min(max, Math.max(min, value))
  }

  return {
    x: clampAxis(cropPosition.x, minX, maxX),
    y: clampAxis(cropPosition.y, minY, maxY),
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
