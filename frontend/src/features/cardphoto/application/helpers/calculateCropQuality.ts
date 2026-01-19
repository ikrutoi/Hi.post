import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { useCardphotoController } from '@cardphoto/application/controllers'
import { roundTo } from '@shared/utils/layout'
import type { LayoutOrientation } from '@layout/domain/types'
import type {
  CropLayer,
  ImageLayer,
  ImageMeta,
  CropMeta,
  QualityLevel,
} from '../../domain/types'

export const calculateCropQuality = (
  crop: CropMeta,
  image: ImageLayer,
  originalImage: ImageMeta,
  orientation: LayoutOrientation,
) => {
  const { minAllowedDpi, maxAllowedDpi, widthMm, heightMm } = CARD_SCALE_CONFIG

  const isCardOrientation = orientation === 'landscape'
  const inches = isCardOrientation ? widthMm / 25.4 : heightMm / 25.4

  const isSideOrientation =
    image.orientation === 90 || image.orientation === 270
  const originalReferenceWidth = isSideOrientation
    ? originalImage.height
    : originalImage.width

  const scale = roundTo(
    originalReferenceWidth / Math.max(1, image.meta.width),
    2,
  )

  const realCropWidthPx = crop.width * scale

  const dpi = Math.round(realCropWidthPx / inches)

  const quality: QualityLevel =
    dpi >= maxAllowedDpi ? 'high' : dpi >= 150 ? 'medium' : 'low'

  const rawProgress = roundTo(
    ((dpi - minAllowedDpi) / (maxAllowedDpi - minAllowedDpi)) * 100,
    2,
  )

  const qualityProgress = Math.max(0, Math.min(100, rawProgress))

  return {
    quality,
    qualityProgress,
    dpi,
    scale,
  }
}

export const dispatchQualityUpdate = (
  progress: number,
  quality: QualityLevel,
) => {
  // console.log('dispatchQuality', progress)
  window.dispatchEvent(
    new CustomEvent('crop-quality-change', {
      detail: { progress, quality },
    }),
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
