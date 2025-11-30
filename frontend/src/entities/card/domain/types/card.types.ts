import type { CardphotoState } from '@entities/cardphoto'
import type { CardtextState } from '@entities/cardtext'
import type { EnvelopeState } from '@envelope/domain/types/envelope.types'
import type { AromaItem } from '@entities/aroma'
import type { DispatchDate } from '@entities/date'

export type {
  CardphotoState,
  CardtextState,
  EnvelopeState,
  AromaItem,
  DispatchDate,
}

export type EditorData =
  | CardphotoState
  | CardtextState
  | EnvelopeState
  | AromaItem
  | DispatchDate

export const CARD_SECTIONS = [
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
] as const
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

export const CARD_STATUS = ['drafts', 'saved', 'trash', 'inProgress'] as const

export type CardStatus = (typeof CARD_STATUS)[number]

export type Card = {
  id: string | null
  status: CardStatus
  cardphoto: Completion<CardphotoState>
  cardtext: Completion<CardtextState>
  envelope: Completion<EnvelopeState>
  aroma: Completion<AromaItem>
  date: Completion<DispatchDate>
}
