import type { CardtextTemplate } from '@cardtext/domain/types'
import type { AddressTemplate } from '@entities/templates'

export const TEMPLATE_STRIP_SECTIONS = [
  'cardtext',
  'sender',
  'recipient',
] as const

export type TemplateStripSection = (typeof TEMPLATE_STRIP_SECTIONS)[number]

export interface SliderLetter {
  letter: string
  id: string
  index: number
}

export interface TemplateStripScrollIndex {
  totalCount: number
  firstLetters: SliderLetter[]
}

export type TemplateStripItem =
  | { section: 'cardtext'; template: CardtextTemplate }
  | { section: 'sender'; template: AddressTemplate }
  | { section: 'recipient'; template: AddressTemplate }

export interface TemplateStripCardSize {
  width: number
  height: number
}
