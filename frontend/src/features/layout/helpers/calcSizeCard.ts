import type { LayoutOrientation, SizeCard } from '../domain/types'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { APP_UI_SCALE_CONFIG } from '@shared/config/constants/uiScale'
import {
  calcAppUiScale,
  getViewportHeightScale,
} from '@shared/utils/layout/calcAppUiScale'

export const calcSizeCard = (
  viewportHeight: number,
  orientation: LayoutOrientation,
  viewportWidth: number = typeof window !== 'undefined'
    ? window.innerWidth
    : APP_UI_SCALE_CONFIG.baselineWidth,
): Omit<SizeCard, 'orientation'> => {
  const { scaleCardHeight, aspectRatio, precision } = CARD_SCALE_CONFIG

  if (!viewportHeight || isNaN(viewportHeight)) {
    return { width: 0, height: 0 }
  }

  const uiScale = calcAppUiScale(viewportWidth, viewportHeight)
  const viewportHeightScale = getViewportHeightScale(viewportHeight)
  const rawHeight =
    viewportHeight *
    scaleCardHeight *
    (uiScale / viewportHeightScale)
  const height = Math.max(0, Number(rawHeight.toFixed(precision)))

  const rawWidth =
    orientation === 'landscape' ? height * aspectRatio : height / aspectRatio

  const width = Math.max(0, Number(rawWidth.toFixed(precision)))

  return { width, height }
}
