export const CARD_SECTIONS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
  'history',
] as const
export type CardSection = (typeof CARD_SECTIONS)[number]
