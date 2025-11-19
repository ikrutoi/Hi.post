export const CARD_PANEL_SOURCE = ['sections', 'templates'] as const

export type CardPanelSource = (typeof CARD_PANEL_SOURCE)[number]

export const CARD_PANEL_SECTIONS_PRIORITY = {
  cardphoto: { position: 0, index: 4 },
  cardtext: { position: 1, index: 3 },
  envelope: { position: 2, index: 2 },
  aroma: { position: 3, index: 1 },
  date: { position: 4, index: 0 },
} as const

export interface CardPanelPriorityEntry {
  position: number
  index: number
}

export type CardPanelSection = keyof typeof CARD_PANEL_SECTIONS_PRIORITY

export interface CardPanelSectionState {
  id: string
  isPacked: boolean
  isValid?: boolean
  isFocused?: boolean
}

export const CARD_PANEL_TEMPLATES = [
  'cardphoto',
  'cardtext',
  'envelopeSender',
  'envelopeRecipient',
] as const

export type CardPanelTemplate = (typeof CARD_PANEL_TEMPLATES)[number]

export interface CardPanelTemplateItem {
  id: string
  template: CardPanelTemplate
  preview: string
  data: unknown
}

export interface CardPanelTemplateState {
  activeTemplate: CardPanelTemplate | null
  templateMode: boolean
  templateList: CardPanelTemplateItem[]
  scrollIndex: number
  valueScroll: number
}

export interface CardPanelViewFlags {
  isCompactView: boolean
  isScrollable: boolean
  isReadyToSend: boolean
}

export interface CardPanelState {
  source: CardPanelSource
  isPacked: boolean
  activeSection: CardPanelSection | null
  activeTemplate: CardPanelTemplate | null
  templateList: CardPanelTemplateItem[]
  scrollIndex: number
  valueScroll: number
}
