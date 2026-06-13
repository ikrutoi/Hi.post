import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { APP_UI_SCALE_CONFIG } from '@shared/config/constants/uiScale'
import type { LayoutOrientation } from '@layout/domain/types'
import { roundTo } from '../../helpers'
import { scaleMeasuredHeightToUiScale } from './calcAppUiScale'

/** Высота внутреннего тулбара cardphoto/cardtext на mobile (совпадает с 2rem в SCSS). */
export const MOBILE_CARD_INNER_TOOLBAR_REM = 2

export type GetSizeCardOptions = {
  orientation?: LayoutOrientation
  aspectRatio?: number
  /**
   * Mobile: квадратная рабочая зона + полоса внутреннего тулбара сверху.
   * `height` = workSide + innerToolbarPx, `width` = workSide.
   */
  innerToolbarPx?: number
}

export const getSizeCard = (
  sizeForm: { width: number; height: number },
  remSize: number,
  viewportHeight: number = typeof window !== 'undefined'
    ? window.innerHeight
    : APP_UI_SCALE_CONFIG.baselineHeight,
  options?: GetSizeCardOptions,
) => {
  const aspectRatio = options?.aspectRatio ?? CARD_SCALE_CONFIG.aspectRatio
  const innerToolbarPx = options?.innerToolbarPx ?? 0

  const boxWidth = scaleMeasuredHeightToUiScale(
    sizeForm.width,
    remSize,
    viewportHeight,
  )
  const boxHeight = scaleMeasuredHeightToUiScale(
    sizeForm.height,
    remSize,
    viewportHeight,
  )

  if (!boxWidth || !boxHeight) {
    return { width: 0, height: 0 }
  }

  if (innerToolbarPx > 0) {
    const maxWorkSide = Math.min(
      boxWidth,
      Math.max(0, boxHeight - innerToolbarPx),
    )
    const workSide = Math.max(0, roundTo.nearest(maxWorkSide))

    return {
      width: workSide,
      height: Math.max(0, roundTo.nearest(workSide + innerToolbarPx)),
    }
  }

  const rawHeight = boxHeight
  const rawWidth = rawHeight * aspectRatio - 2 * remSize

  return {
    width: Math.max(0, roundTo.nearest(rawWidth)),
    height: Math.max(0, roundTo.nearest(rawHeight)),
  }
}
