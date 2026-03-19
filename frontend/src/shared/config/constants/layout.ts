export const CARD_SCALE_CONFIG = {
  scaleCardHeight: 0.8,
  aspectRatio: 1,
  // aspectRatio: 1.42,
  precision: 2,
  scaleMiniCard: 1 / 11,
  scaleCrop: 0.9,
  deltaAspectRatio: 0.2,
  widthMm: 125,
  heightMm: 125,
  minAllowedDpi: 100,
  maxAllowedDpi: 300,
  maxPreviewToolbarRight: 11,
} as const

export type CardScaleConfig = typeof CARD_SCALE_CONFIG
