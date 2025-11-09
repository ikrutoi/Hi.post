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

export type CardSection = (typeof CARD_SECTIONS)[number]

export type Completion<T> =
  | { isComplete: false }
  | { isComplete: true; data: T }

export type CardEditor = {
  cardphoto: Completion<CardphotoState>
  cardtext: Completion<CardtextState>
  envelope: Completion<EnvelopeState>
  aroma: Completion<AromaItem>
  date: Completion<DispatchDate>
  id: string | null
}

export type CardSaved = {
  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeState
  aroma: AromaItem
  date: CardDispatchDate
  id: string
}
