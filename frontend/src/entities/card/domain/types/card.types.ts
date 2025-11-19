import type { CardphotoState } from '@entities/cardphoto'
import type { CardtextState } from '@entities/cardtext'
import type { EnvelopeState } from '@shared/config/constants'
import type { AromaItem } from '@entities/aroma'
import type { DispatchDate, CardDispatchDate } from '@entities/date'

export type {
  CardphotoState,
  CardtextState,
  EnvelopeState,
  AromaItem,
  DispatchDate,
}

export const CARD_SECTIONS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
] as const

export const CARD_TEMPLATE_SECTIONS = [
  'cardphoto',
  'cardtext',
  'envelope',
] as const

export type CardTemplateSection = (typeof CARD_TEMPLATE_SECTIONS)[number]

export type CardSection = (typeof CARD_SECTIONS)[number]

export type CardEditorDataMap = {
  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeState
  aroma: AromaItem
  date: DispatchDate
}

export type Completion<T> =
  | { isComplete: false }
  | { isComplete: true; data: T }

export type CardEditor = {
  id: string | null
  templates: CardEditorTemplateMap
} & {
  [K in keyof CardEditorDataMap]: Completion<CardEditorDataMap[K]>
}

export type CardEditorTemplateMap = Partial<
  Record<'cardphoto' | 'cardtext' | 'envelope', string>
>

export type CardSaved = {
  id: string
} & {
  [K in keyof CardEditorDataMap]: CardEditorDataMap[K]
}
