const CIRCLE_CENTER_OFFSET = 0.03

const MAX_CONCENTRIC_CIRCLES = 10

function getOuterSizePercentForDiagonal(): number {
  return 2 * (1 - CIRCLE_CENTER_OFFSET) * Math.SQRT2 * 100
}

export type ConcentricCirclePalette = {
  opacityMin: number
  opacityMax: number
  singleSizePercent: number
  singleOpacity: number
}

export type ConcentricCircleStep = {
  sizePercent: number
  opacity: number
}

export type ConcentricCircleStepsResult = {
  steps: ConcentricCircleStep[]
  /** Зарезервировано под будущую разметку; сейчас всегда `false`. */
  isMany: boolean
}

/** Пресет: мини-конверт, несколько получателей (как раньше ENVELOPE_CIRCLE_PALETTE). */
export const miniCardCirclePaletteEnvelopeRecipients: ConcentricCirclePalette = {
  opacityMin: 0.05,
  opacityMax: 0.18,
  singleSizePercent: 72,
  singleOpacity: 0.08,
}

/** Пресет: мини-дата, мульти-дни на светлом фоне поля даты. */
export const miniCardCirclePaletteDateMulti: ConcentricCirclePalette = {
  opacityMin: 0.22,
  opacityMax: 0.78,
  singleSizePercent: 72,
  singleOpacity: 0.4,
}

/**
 * Вложенные круги в углу мини-карточки (геометрия общая для конверта и даты).
 * @param count число элементов (1 или 2…MAX); при count > MAX используется MAX колец.
 */
export function getConcentricCircleSteps(
  count: number,
  palette: ConcentricCirclePalette,
): ConcentricCircleStepsResult {
  if (count < 1) {
    return { steps: [], isMany: false }
  }

  const n = count === 1 ? 1 : Math.min(count, MAX_CONCENTRIC_CIRCLES)

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
  const sizeOuterPercent = getOuterSizePercentForDiagonal()
  const radiusOuter = sizeOuterPercent / 2
  const steps: ConcentricCircleStep[] = []

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

export function getEnvelopeRecipientCircleSteps(
  count: number,
): ConcentricCircleStepsResult {
  return getConcentricCircleSteps(count, miniCardCirclePaletteEnvelopeRecipients)
}

export function getDateMultiMiniCircleSteps(
  count: number,
): ConcentricCircleStepsResult {
  return getConcentricCircleSteps(count, miniCardCirclePaletteDateMulti)
}
