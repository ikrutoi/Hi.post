export const CARD_SECTIONS = [
  'cardphoto',
  'cardtext',
  'envelope',
  // 'aroma',
  // 'date',
  // 'history',
] as const

export type CardSectionName = (typeof CARD_SECTIONS)[number]

export interface SectionMeta {
  section: CardSectionName
  position: number
  index: number
}

export const BASE_SECTIONS_META: Record<CardSectionName, SectionMeta> = {
  cardphoto: { section: 'cardphoto', position: 0, index: 5 },
  cardtext: { section: 'cardtext', position: 1, index: 4 },
  envelope: { section: 'envelope', position: 2, index: 3 },
  // aroma: { section: 'aroma', position: 3, index: 2 },
  // date: { section: 'date', position: 4, index: 1 },
  // history: { section: 'history', position: 5, index: 0 },
}
