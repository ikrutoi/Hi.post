import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { APP_UI_SCALE_CONFIG } from '@shared/config/constants/uiScale'
import type { LayoutOrientation } from '@layout/domain/types'
import { roundTo } from '../../helpers'
import { scaleMeasuredHeightToUiScale } from './calcAppUiScale'

/** Mobile factory toolbar row — matches $section-inner-toolbar-height-desktop (2.25rem). */
export const MOBILE_CARD_INNER_TOOLBAR_REM = 2.25

/** Mobile factory shell: upper (section) + lower (scenario) toolbar rows. */
export const MOBILE_FACTORY_TOOLBAR_ROW_COUNT = 2

export type GetSizeCardOptions = {
  orientation?: LayoutOrientation
  aspectRatio?: number
  /**
   * Mobile: резерв под полосы тулбара при расчёте квадратной рабочей зоны.
   * При `sectionHeightWorkSideOnly` в `height` попадает только workSide (тулбары вне sizeCard).
   */
  innerToolbarPx?: number
  sectionHeightWorkSideOnly?: boolean
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

    const sectionHeight = options?.sectionHeightWorkSideOnly
      ? workSide
      : workSide + innerToolbarPx

    return {
      width: workSide,
      height: Math.max(0, roundTo.nearest(sectionHeight)),
    }
  }

  const rawHeight = boxHeight
  const rawWidth = rawHeight * aspectRatio - 2 * remSize

  return {
    width: Math.max(0, roundTo.nearest(rawWidth)),
    height: Math.max(0, roundTo.nearest(rawHeight)),
  }
}
