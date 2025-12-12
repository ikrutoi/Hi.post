import type { CardtextValue } from './cardtext.types'

export const EMPTY_PARAGRAPH: CardtextValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export const DEFAULT_CARDTEXT_LINES = 15
export const DEFAULT_LINE_HEIGHT = 20
export const DEFAULT_FONT_SIZE = 14
export const FONT_SIZE_COEFFICIENT = 0.75
