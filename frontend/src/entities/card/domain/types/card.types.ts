import type { CardphotoState } from '@entities/cardphoto'
import type { CardtextState } from '@entities/cardtext'
import type { EnvelopeState } from '@shared/config/constants'
import type { AromaState } from '@entities/aroma'
import type { DispatchDate } from '@entities/date'

export type {
  CardphotoState,
  CardtextState,
  EnvelopeState,
  AromaState,
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

export type CardItem = {
  cardphoto: Completion<CardphotoState>
  cardtext: Completion<CardtextState>
  envelope: Completion<EnvelopeState>
  aroma: Completion<AromaState>
  date: Completion<DispatchDate>
  id: string | null
}
