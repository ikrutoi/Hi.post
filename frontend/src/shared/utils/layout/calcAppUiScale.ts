import {
  APP_UI_SCALE_CONFIG,
  type AppUiScaleConfig,
} from '@shared/config/constants/uiScale'

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function calcAppUiScale(
  width: number,
  height: number,
  config: AppUiScaleConfig = APP_UI_SCALE_CONFIG,
): number {
  if (!width || !height) return 1

  const widthRatio = width / config.baselineWidth
  const heightRatio = height / config.baselineHeight
  const rawScale = Math.min(widthRatio, heightRatio)

  return clamp(rawScale, config.minScale, config.maxScale)
}

export function getViewportHeightScale(
  viewportHeight: number,
  config: AppUiScaleConfig = APP_UI_SCALE_CONFIG,
): number {
  if (!viewportHeight) return 1

  return clamp(
    viewportHeight / config.baselineHeight,
    config.minScale,
    config.maxScale,
  )
}

/**
 * Maps a layout-measured height (form / panel px) to the shared UI scale curve.
 * Viewport-tall layouts grow with vh; chrome uses `--app-ui-scale` on rem — this
 * keeps the postcard preview aligned with toolbar/lists on 2K+ displays.
 */
export function scaleMeasuredHeightToUiScale(
  measuredHeight: number,
  remSize: number,
  viewportHeight: number = typeof window !== 'undefined'
    ? window.innerHeight
    : APP_UI_SCALE_CONFIG.baselineHeight,
  config: AppUiScaleConfig = APP_UI_SCALE_CONFIG,
): number {
  if (!measuredHeight) return 0

  const uiScale = remSize / config.rootFontSizePx
  const viewportHeightScale = getViewportHeightScale(viewportHeight, config)

  if (!viewportHeightScale) return measuredHeight

  return measuredHeight * (uiScale / viewportHeightScale)
}
