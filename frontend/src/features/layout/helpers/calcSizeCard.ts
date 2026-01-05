import { LayoutOrientation, SizeCard } from '../domain/types'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'

export const calcSizeCard = (
  viewportHeight: number,
  orientation: LayoutOrientation
): Omit<SizeCard, 'orientation'> => {
  const { scaleCardHeight, aspectRatio, precision } = CARD_SCALE_CONFIG

  if (!viewportHeight || isNaN(viewportHeight)) {
    return { width: 0, height: 0 }
  }

  const rawHeight = viewportHeight * scaleCardHeight
  const height = Math.max(0, Number(rawHeight.toFixed(precision)))

  const rawWidth =
    orientation === 'landscape' ? height * aspectRatio : height / aspectRatio

  const width = Math.max(0, Number(rawWidth.toFixed(precision)))

  return { width, height }
}
