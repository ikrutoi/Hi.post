const CIRCLE_CENTER_OFFSET = 0.03

function getSizeOuterForDiagonal(): number {
  return 2 * (1 - CIRCLE_CENTER_OFFSET) * Math.SQRT2 * 100
}

export const ENVELOPE_CIRCLE_PALETTE = {
  /** Opacity range: outer (light) → inner (dark) */
  opacityMin: 0.05,
  opacityMax: 0.18,
  /** Single recipient: one circle */
  singleSizePercent: 72,
  singleOpacity: 0.08,
} as const

/** Видны на светлом `$color-date-input`; та же геометрия, что у конверта. */
export const DATE_MULTI_CIRCLE_PALETTE = {
  opacityMin: 0.22,
  opacityMax: 0.78,
  singleSizePercent: 72,
  singleOpacity: 0.4,
} as const

export type CirclePalette = {
  opacityMin: number
  opacityMax: number
  singleSizePercent: number
  singleOpacity: number
}

export const ENVELOPE_CIRCLE_COUNT = {
  min: 1,
  max: 10,
  manyThreshold: 11,
} as const

export type EnvelopeCircleStep = {
  sizePercent: number
  opacity: number
}

function getCircleStepsForPalette(
  count: number,
  palette: CirclePalette,
): {
  steps: EnvelopeCircleStep[]
  isMany: boolean
} {
  if (count < 1) {
    return { steps: [], isMany: false }
  }

  const n = count === 1 ? 1 : Math.min(count, ENVELOPE_CIRCLE_COUNT.max)

  if (n === 1) {
    return {
      steps: [
        {
          sizePercent: palette.singleSizePercent,
          opacity: palette.singleOpacity,
        },
      ],
      isMany: false,
    }
  }

  const { opacityMin, opacityMax } = palette
  const sizeOuterPercent = getSizeOuterForDiagonal()
  const radiusOuter = sizeOuterPercent / 2
  const steps: EnvelopeCircleStep[] = []

  const radiusStep = radiusOuter / n
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const radius = radiusOuter - i * radiusStep
    steps.push({
      sizePercent: radius * 2,
      opacity: opacityMin + (opacityMax - opacityMin) * t,
    })
  }

  return { steps, isMany: false }
}

/**
 * Returns circle steps for the given recipient count.
 * - 1: one circle (single)
 * - 2–10: n circles, sizes and opacities interpolated (outer light → inner dark)
 * - 11+: same as 10 (10 circles, same color)
 */
export function getEnvelopeCircleSteps(count: number): {
  steps: EnvelopeCircleStep[]
  isMany: boolean
} {
  return getCircleStepsForPalette(count, ENVELOPE_CIRCLE_PALETTE)
}

export function getDateMultiCircleSteps(count: number): {
  steps: EnvelopeCircleStep[]
  isMany: boolean
} {
  return getCircleStepsForPalette(count, DATE_MULTI_CIRCLE_PALETTE)
}
