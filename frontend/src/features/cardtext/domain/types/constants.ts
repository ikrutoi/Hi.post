import type { CardtextValue } from './cardtext.types'

export const EMPTY_PARAGRAPH: CardtextValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export const DEFAULT_CARDTEXT_LINES = 15
export const FONT_SIZE_COEFFICIENT = 0.75
export const FONT_SIZE_COEFFICIENT_MINICARD = 0.73

export const CARDTEXT_CONFIG = {
  step: 6,
}
