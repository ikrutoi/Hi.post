import type { CardphotoState } from '@entities/cardphoto'
import type { CardtextState } from '@entities/cardtext'
import type { EnvelopeState } from '@envelope/domain/types/envelope.types'
import type { AromaItem } from '@entities/aroma'
import type { DispatchDate } from '@entities/date'

export const CARD_STATUSES = ['cart', 'drafts', 'sent'] as const
export type CardStatus = (typeof CARD_STATUSES)[number]

export type Card = {
  id: string
  status: CardStatus
  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeState
  aroma: AromaItem
  date: DispatchDate
}
