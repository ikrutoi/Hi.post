import type { CardphotoSessionRecord } from '@cardphoto/domain/types'
import type { CardtextTemplateContent } from '@cardtext/domain/types'
import type {
  EnvelopeSessionRecord,
  RecipientState,
} from '@envelope/domain/types'
import type { AromaState } from '@entities/aroma/domain/types'
import type { DateState } from '@entities/date/domain/types'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { SizeCard } from '@layout/domain/types'
import type { PreviewStripOrderState } from '@features/previewStrip/infrastructure/state'

export interface SessionEnvelopeSelection {
  recipientsPendingIds: string[]
  recipientMode?: 'recipient' | 'recipients'
  recipientTemplateId?: string | null
  senderTemplateId?: string | null
}

export interface SessionData {
  id: string
  cardphoto: CardphotoSessionRecord | null
  cardtext: (CardtextTemplateContent & { templateId: string | null }) | null
  /** When true, cardtext is shown in preview (CardtextView) instead of editor. */
  cardtextShowViewMode?: boolean
  envelope: EnvelopeSessionRecord | null
  /** Список получателей (режим «несколько»), сохраняется отдельно от envelope. */
  envelopeRecipients?: RecipientState[] | null
  aroma: AromaState | null
  date: DateState | null
  activeSection: SectionEditorMenuKey
  sizeCard: SizeCard
  previewStripOrder: PreviewStripOrderState | null
  envelopeSelection?: SessionEnvelopeSelection | null
  timestamp: number
}
