import { APP_UI_SCALE_CONFIG } from '@shared/config/constants/uiScale'

const APP_UI_SCALE_CSS_VAR = '--app-ui-scale'

export function applyAppUiScale(scale: number): void {
  if (typeof document === 'undefined') return

  document.documentElement.style.setProperty(
    APP_UI_SCALE_CSS_VAR,
    scale.toFixed(4),
  )
}

export function getRootRemSizePx(): number {
  if (typeof document === 'undefined') {
    return APP_UI_SCALE_CONFIG.rootFontSizePx
  }

  return parseFloat(getComputedStyle(document.documentElement).fontSize)
}
