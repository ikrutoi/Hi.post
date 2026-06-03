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
