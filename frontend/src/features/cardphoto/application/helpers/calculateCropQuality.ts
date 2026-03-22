import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type { LayoutOrientation } from '@layout/domain/types'
import type { CropMeta, ImageLayer, ImageMeta } from '../../domain/types'

const { minAllowedDpi, maxAllowedDpi, widthMm } = CARD_SCALE_CONFIG

const calculateSteppedProgress = (currentDpi: number) => {
  const min = minAllowedDpi
  const max = maxAllowedDpi
  const step = 2
  const exactProgress = ((currentDpi - min) / (max - min)) * 100
  const stepped = Math.round(exactProgress / step) * step

  return Math.max(0, Math.min(100, stepped))
}

export const calculateCropQuality = (
  crop: CropMeta,
  image: ImageLayer,
  originalImage: ImageMeta,
  orientation: LayoutOrientation,
) => {
  void orientation
  const inches = widthMm / 25.4

  const isSideOrientation = image.rotation === 90 || image.rotation === 270

  const scale = originalImage.width / Math.max(1, image.meta.width)

  const realCropWidthPx = isSideOrientation
    ? crop.width * (originalImage.height / image.meta.height)
    : crop.width * scale

  const dpi = Math.round(realCropWidthPx / inches)

  const rawProgress = calculateSteppedProgress(dpi)
  const clamped = Math.max(0, Math.min(100, rawProgress))
  const qualityProgress = Number.isFinite(clamped) ? clamped : 0
  const safeDpi = Number.isFinite(dpi) ? dpi : 0
  const safeScale = Number.isFinite(scale) ? scale : 1

  return {
    qualityProgress,
    dpi: safeDpi,
    scale: safeScale,
  }
}

export const dispatchQualityUpdate = (progress: number) => {
  window.dispatchEvent(
    new CustomEvent('crop-quality-change', {
      detail: { progress },
    }),
  )
}

export const getQualityColor = (progress: number) => {
  const colors = {
    red: { r: 244, g: 67, b: 54 },
    yellow: { r: 255, g: 193, b: 7 },
    green: { r: 76, g: 175, b: 80 },
  }

  let r, g, b

  if (progress <= 50) {
    const ratio = progress / 50
    r = Math.round(colors.red.r + (colors.yellow.r - colors.red.r) * ratio)
    g = Math.round(colors.red.g + (colors.yellow.g - colors.red.g) * ratio)
    b = Math.round(colors.red.b + (colors.yellow.b - colors.red.b) * ratio)
  } else {
    const ratio = (progress - 50) / 50
    r = Math.round(colors.yellow.r + (colors.green.r - colors.yellow.r) * ratio)
    g = Math.round(colors.yellow.g + (colors.green.g - colors.yellow.g) * ratio)
    b = Math.round(colors.yellow.b + (colors.green.b - colors.yellow.b) * ratio)
  }

  return `rgb(${r}, ${g}, ${b})`
}
