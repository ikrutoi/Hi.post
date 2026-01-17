import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import type {
  CropLayer,
  ImageLayer,
  ImageMeta,
  QualityLevel,
} from '../../domain/types'

export const calculateCropQuality = (
  crop: CropLayer,
  image: ImageLayer,
  meta: ImageMeta
) => {
  const { minAllowedDpi, maxAllowedDpi, widthMm } = CARD_SCALE_CONFIG

  const inches = widthMm / 25.4

  const scale = meta.width / Math.max(1, image.meta.width)

  const realCropWidthPx = crop.meta.width * scale

  const dpi = Math.round(realCropWidthPx / inches)

  const quality: QualityLevel =
    dpi >= maxAllowedDpi ? 'high' : dpi >= 150 ? 'medium' : 'low'

  const rawProgress =
    ((dpi - minAllowedDpi) / (maxAllowedDpi - minAllowedDpi)) * 100
  const qualityProgress = Math.max(
    0,
    Math.min(100, Math.round(rawProgress * 100) / 100)
  )

  return { quality, qualityProgress, dpi }
}

export const dispatchQualityUpdate = (
  progress: number,
  quality: QualityLevel
) => {
  window.dispatchEvent(
    new CustomEvent('crop-quality-change', {
      detail: { progress, quality },
    })
  )
}

// export const getQualityColor = (progress: number) => {
//   if (progress > 70) return '#4CAF50'
//   if (progress > 30) return '#FFC107'
//   return '#F44336'
// }

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
