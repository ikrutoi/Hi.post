import type { CardphotoState } from '@cardphoto/domain/types'
import type { CardtextState } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { DispatchDate } from '@entities/date'
import type { PostcardStatus } from '@entities/postcard/domain/types/postcard.types'
import { CardSection } from '@shared/config/constants'

export * from './cardReference.types'

export interface Card {
  id: string
  multiGroupId?: string | null
  thumbnailUrl: string
  isProcessed?: boolean

  cardphoto: CardphotoState
  cardtext: CardtextState
  envelope: EnvelopeSessionRecord
  aroma: AromaItem
  date: DispatchDate
}

export type CardsByDateMap = Record<string, Card[]>

export interface CalendarCardItem {
  cardId: string
  rowKey: string
  date: DispatchDate
  previewUrl: string
  status: PostcardStatus
  /**
   * Слот редактора / синхронизированная карта — скрывает индикатор статуса на миниатюре.
   * Не путать с наличием превью у открытки в корзине/истории.
   */
  isProcessed?: boolean
  /** Разрешить blob:/сессионное превью в списках и ячейках календаря. */
  previewAllowBlob?: boolean
}

export type CalendarPreviewCache = Record<string, string>

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
  calendarPreviewCache: CalendarPreviewCache
  activeSection: CardSection | null
  isReady: boolean
  previewCardId: string | null
}
