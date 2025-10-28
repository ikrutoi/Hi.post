export const CARD_MENU_SECTIONS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
  'history',
] as const

export type CardMenuSection = (typeof CARD_MENU_SECTIONS)[number]
