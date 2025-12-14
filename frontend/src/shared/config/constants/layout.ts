export const CARD_SCALE_CONFIG = {
  scaleCardHeight: 0.8,
  aspectRatio: 1.42,
  precision: 2,
  scaleMiniCard: 1 / 7,
} as const

export type CardScaleConfig = typeof CARD_SCALE_CONFIG
