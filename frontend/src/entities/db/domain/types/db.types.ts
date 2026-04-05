import type { CardphotoSessionRecord } from '@cardphoto/domain/types'
import type {
  CardtextContent,
  CardtextCreateDraft,
  CardtextEditorSessionSnapshot,
} from '@cardtext/domain/types'
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
  /** assetData, presetData, appliedData, draftData — см. CardtextState. */
  cardtextEditor?: CardtextEditorSessionSnapshot | null
  /** @deprecated старые сессии; читать только при отсутствии cardtextEditor */
  cardtext?: CardtextContent | null
  cardtextPresetData?: CardtextContent | null
  cardtextCreateDraft?: CardtextCreateDraft | null
  envelope: EnvelopeSessionRecord | null
  envelopeRecipients?: RecipientState[] | null
  aroma: AromaState | null
  date: DateState | null
  activeSection: SectionEditorMenuKey
  sizeCard: SizeCard
  previewStripOrder: PreviewStripOrderState | null
  envelopeSelection?: SessionEnvelopeSelection | null
  /** CardPie: избранное текущей открытки в редакторе. */
  pieFavorite?: boolean
  timestamp: number
}
