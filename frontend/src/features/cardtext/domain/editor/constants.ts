export const DEFAULT_CARDTEXT_LINES = 15
export const FONT_SIZE_COEFFICIENT = 0.75
export const FONT_SIZE_COEFFICIENT_MINICARD = 0.73
/**
 * Visual-only cap for mobile composer and factory View.
 * Stored `fontSizeStep` / STEP_TO_PX stay unchanged; CSS also follows
 * field size vs `--card-width` when the keyboard shrinks the field.
 */
export const CARDTEXT_CREATE_FIELD_FONT_SCALE = 0.88
export const CARDTEXT_CREATE_FIELD_FONT_SCALE_MIN = 0.6

import { STEP_TO_PX } from './editor.types'

export const CARDTEXT_CONFIG = {
  step: STEP_TO_PX.length,
}
