import { CARD_SCALE_CONFIG } from '../config/constants'

const DEFAULT_PRECISION = CARD_SCALE_CONFIG.precision

const safe = (value: number): number => (Number.isFinite(value) ? value : 0)

export const roundTo = {
  nearest: (value: number, precision = DEFAULT_PRECISION): number =>
    Math.round(safe(value) * 10 ** precision) / 10 ** precision,

  up: (value: number, precision = DEFAULT_PRECISION): number =>
    Math.ceil(safe(value) * 10 ** precision) / 10 ** precision,

  down: (value: number, precision = DEFAULT_PRECISION): number =>
    Math.floor(safe(value) * 10 ** precision) / 10 ** precision,
}
