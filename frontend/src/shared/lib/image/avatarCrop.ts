/** Доля стороны квадрата — радиус скругления углов. */
export const AVATAR_CORNER_RADIUS_RATIO = 0.12

export type AvatarCropPixels = {
  x: number
  y: number
  size: number
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

export function getInitialAvatarCropState(
  imageWidth: number,
  imageHeight: number,
  viewportSize: number,
): { position: { x: number; y: number } } {
  const baseScale = Math.max(
    viewportSize / imageWidth,
    viewportSize / imageHeight,
  )
  const displayWidth = imageWidth * baseScale
  const displayHeight = imageHeight * baseScale

  return {
    position: {
      x: (viewportSize - displayWidth) / 2,
      y: (viewportSize - displayHeight) / 2,
    },
  }
}

export function getAvatarImageDisplaySize(
  imageWidth: number,
  imageHeight: number,
  viewportSize: number,
): { width: number; height: number; baseScale: number } {
  const baseScale = Math.max(
    viewportSize / imageWidth,
    viewportSize / imageHeight,
  )
  return {
    baseScale,
    width: imageWidth * baseScale,
    height: imageHeight * baseScale,
  }
}

export function clampAvatarCropPosition(
  position: { x: number; y: number },
  displayWidth: number,
  displayHeight: number,
  viewportSize: number,
): { x: number; y: number } {
  const minX = viewportSize - displayWidth
  const minY = viewportSize - displayHeight

  return {
    x: Math.min(0, Math.max(minX, position.x)),
    y: Math.min(0, Math.max(minY, position.y)),
  }
}

export function getAvatarCropPixels(
  imageWidth: number,
  imageHeight: number,
  viewportSize: number,
  position: { x: number; y: number },
): AvatarCropPixels {
  const { width: displayWidth } = getAvatarImageDisplaySize(
    imageWidth,
    imageHeight,
    viewportSize,
  )
  const scale = displayWidth / imageWidth
  const cropSize = viewportSize / scale

  return {
    x: -position.x / scale,
    y: -position.y / scale,
    size: cropSize,
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
