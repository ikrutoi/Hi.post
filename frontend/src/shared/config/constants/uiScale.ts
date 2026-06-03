export const APP_UI_SCALE_CONFIG = {
  /** Reference viewport the UI was originally tuned for. */
  baselineWidth: 1920,
  baselineHeight: 1080,
  rootFontSizePx: 16,
  minScale: 0.9,
  maxScale: 1.25,
} as const

export type AppUiScaleConfig = typeof APP_UI_SCALE_CONFIG
