import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { AromaItem, AromaState } from '@entities/aroma/domain/types'
import type { DispatchDate } from '@entities/date'
import { CardSection } from '@shared/config/constants'

export const CARD_STATUSES = [
  'processed',
  'cart',
  'ready',
  'drafts',
  'sent',
  'delivered',
  'error',
] as const
export type CardStatus = (typeof CARD_STATUSES)[number]

export interface Card {
  id: string
  status: CardStatus
  thumbnailUrl: string

  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeSessionRecord
  aroma: AromaItem
  date: DispatchDate

  meta: {
    localId?: number
    price?: string
    createdAt: number
    updatedAt: number
  }
}

export type CardsByDateMap = Record<string, Card[]>

export interface CalendarCardItem {
  cardId: string
  date: DispatchDate
  previewUrl: string
  status: CardStatus
}

export interface CardCalendarIndex {
  processed: CalendarCardItem | null
  cart: CalendarCardItem[]
  ready: CalendarCardItem[]
  sent: CalendarCardItem[]
  delivered: CalendarCardItem[]
  error: CalendarCardItem[]
}

export interface CardState {
  cards: Card[]
  calendarIndex: CardCalendarIndex
  activeSection: CardSection | null
  isReady: boolean
  previewCardId: string | null
}
