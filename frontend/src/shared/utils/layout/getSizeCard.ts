import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { APP_UI_SCALE_CONFIG } from '@shared/config/constants/uiScale'
import { roundTo } from '../../helpers'
import type { SizeCard } from '@layout/domain/types'
import { scaleMeasuredHeightToUiScale } from './calcAppUiScale'

export const getSizeCard = (
  sizeForm: { width: number; height: number },
  remSize: number,
  viewportHeight: number = typeof window !== 'undefined'
    ? window.innerHeight
    : APP_UI_SCALE_CONFIG.baselineHeight,
) => {
  const rawHeight = scaleMeasuredHeightToUiScale(
    sizeForm.height,
    remSize,
    viewportHeight,
  )
  const rawWidth = rawHeight * CARD_SCALE_CONFIG.aspectRatio - 2 * remSize

  return {
    width: roundTo.nearest(rawWidth),
    height: roundTo.nearest(rawHeight),
  }
}
