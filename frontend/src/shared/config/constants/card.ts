export const CARD_SECTIONS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
] as const
export type CardSection = (typeof CARD_SECTIONS)[number]
