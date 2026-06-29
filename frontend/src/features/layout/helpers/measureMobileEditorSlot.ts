import { getMobileCardHeightMeasureReserve } from './getMobileCardHeightMeasureReserve'

export interface MobileEditorSlotMeasure {
  slotWidth: number
  slotHeight: number
  contentWidth: number
  contentHeight: number
  /** Visible mobile factory toolbar shell height (0 when peek/list chrome hides it). */
  factoryToolbarPx: number
}

const MOBILE_FACTORY_TOOLBAR_SHELL_SELECTOR =
  '[aria-label="Section toolbars"]'

export function measureFactoryToolbarReservePx(formEl: HTMLElement): number {
  const shell = formEl.querySelector(MOBILE_FACTORY_TOOLBAR_SHELL_SELECTOR)
  if (!(shell instanceof HTMLElement)) return 0
  const height = shell.getBoundingClientRect().height
  return height > 0 ? Math.round(height) : 0
}

/** Доступная область центральной секции под карточку (mobile form slot). */
export function measureMobileEditorSlot(
  formEl: HTMLElement,
  remSize: number,
  viewportHeight: number,
): MobileEditorSlotMeasure {
  const formStyle = getComputedStyle(formEl)
  const paddingTopPx = Number.parseFloat(formStyle.paddingTop) || 0
  const paddingBottomPx = Number.parseFloat(formStyle.paddingBottom) || 0
  const parent = formEl.parentElement

  const slotWidth = Math.max(
    formEl.clientWidth,
    parent?.clientWidth ?? 0,
    typeof window !== 'undefined' ? window.innerWidth : 0,
  )

  const slotHeight = Math.max(
    parent?.clientHeight ?? 0,
    formEl.clientHeight,
  )

  const reservePx = getMobileCardHeightMeasureReserve(remSize, viewportHeight)

  const contentHeight = Math.max(
    0,
    slotHeight - paddingTopPx - paddingBottomPx - reservePx,
  )

  const shellStyle = parent ? getComputedStyle(parent) : null
  const insetVar = shellStyle?.getPropertyValue('--mobile-section-inset').trim()
  const insetPx = insetVar.endsWith('rem')
    ? Number.parseFloat(insetVar) * remSize
    : insetVar.endsWith('px')
      ? Number.parseFloat(insetVar)
      : 0

  const contentWidth = Math.max(0, slotWidth - insetPx * 2)

  return {
    slotWidth,
    slotHeight,
    contentWidth,
    contentHeight,
    factoryToolbarPx: measureFactoryToolbarReservePx(formEl),
  }
}
