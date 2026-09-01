import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { APP_UI_SCALE_CONFIG } from '@shared/config/constants/uiScale'
import type { LayoutOrientation } from '@layout/domain/types'
import { roundTo } from '../../helpers'
import { scaleMeasuredHeightToUiScale } from './calcAppUiScale'

/** Mobile factory toolbar row — derived from section toolbar hit-area + padding. */
export const MOBILE_CARD_INNER_TOOLBAR_REM = 2.25

/** Mobile factory shell: upper (section) + lower (scenario) toolbar rows. */
export const MOBILE_FACTORY_TOOLBAR_ROW_COUNT = 2

/** Keep in sync with `$section-inner-toolbar-height-desktop` in uiLayout.scss. */
export const DESKTOP_FACTORY_TOOLBAR_ROW_REM = 2.25

/** Desktop factory shell: upper (section) + lower (scenario) toolbar rows. */
export const DESKTOP_FACTORY_TOOLBAR_ROW_COUNT = 2

/** Gap between the two-row toolbar stack and the square section. */
export const DESKTOP_FACTORY_SECTION_GAP_REM = 0.5

/** Orange factory stack padding above the blue toolbar and below the section. */
export const DESKTOP_FACTORY_STACK_PAD_Y_REM = 0.5

/** Two toolbar rows + 1px divider + gap + stack padding above/below. */
export function getDesktopFactoryToolbarReservePx(remSize: number): number {
  return Math.round(
    (DESKTOP_FACTORY_TOOLBAR_ROW_COUNT * DESKTOP_FACTORY_TOOLBAR_ROW_REM +
      DESKTOP_FACTORY_SECTION_GAP_REM +
      2 * DESKTOP_FACTORY_STACK_PAD_Y_REM) *
      remSize +
      1,
  )
}

/** Largest square that fits in the desktop center slot under the factory toolbars. */
export function getDesktopSquareWorkSide(
  slot: { width: number; height: number },
  remSize: number,
): number {
  const reserve = getDesktopFactoryToolbarReservePx(remSize)
  return Math.max(
    0,
    roundTo.nearest(
      Math.min(slot.width, Math.max(0, slot.height - reserve)),
    ),
  )
}

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
