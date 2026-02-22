import type { CardphotoSessionRecord } from '@cardphoto/domain/types'
import type { CardtextSessionRecord } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { AromaState } from '@entities/aroma/domain/types'
import type { DateState } from '@entities/date/domain/types'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { SizeCard } from '@layout/domain/types'
import type { PreviewStripOrderState } from '@features/previewStrip/infrastructure/state'

/**
 * Выбор получателей для текущей открытки (мультивыбор).
 * Хранится в сессии и в IndexedDB (время до корзины может быть долгим).
 * Для зарегистрированных пользователей тот же объект можно отправлять на бэкенд (PUT /api/.../session-draft).
 */
export interface SessionEnvelopeSelection {
  selectedRecipientIds: string[]
}

export interface SessionData {
  id: string
  cardphoto: CardphotoSessionRecord | null
  cardtext: CardtextSessionRecord | null
  envelope: EnvelopeSessionRecord | null
  aroma: AromaState | null
  date: DateState | null
  activeSection: SectionEditorMenuKey
  sizeCard: SizeCard
  /** Порядок превью (cardtext и envelope) для стабильного отображения после перезагрузки */
  previewStripOrder: PreviewStripOrderState | null
  /** Выбранные id получателей (сохраняем в IndexedDB; время до корзины может быть долгим) */
  envelopeSelection?: SessionEnvelopeSelection | null
  timestamp: number
}
