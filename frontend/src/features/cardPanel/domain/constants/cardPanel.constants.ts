export const CARD_ACTIONS = ['addCart', 'save', 'remove'] as const
export const FULL_CARD_ACTIONS = ['addCart', 'save', 'remove'] as const

export const SOURCES = ['cart', 'drafts'] as const
export const SECTIONS = [
  'aroma',
  'date',
  'envelope',
  'cardtext',
  'cardphoto',
] as const

export type CardAction = (typeof CARD_ACTIONS)[number]

export type CardActionsState = {
  [key in CardAction]: boolean
}
