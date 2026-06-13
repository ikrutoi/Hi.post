import { getMobileCardHeightMeasureReserve } from './getMobileCardHeightMeasureReserve'

export interface MobileEditorSlotMeasure {
  slotWidth: number
  slotHeight: number
  contentWidth: number
  contentHeight: number
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
  }
}
