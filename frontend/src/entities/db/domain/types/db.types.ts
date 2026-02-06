import type { CardphotoSessionRecord } from '@cardphoto/domain/types'
import type { CardtextSessionRecord } from '@cardtext/domain/types'
import type { EnvelopeSessionRecord } from '@envelope/domain/types'
import type { SectionEditorMenuKey } from '@toolbar/domain/types'
import type { SizeCard } from '@layout/domain/types'

export interface SessionData {
  id: string
  cardphoto: CardphotoSessionRecord | null
  cardtext: CardtextSessionRecord | null
  envelope: EnvelopeSessionRecord | null
  activeSection: SectionEditorMenuKey
  sizeCard: SizeCard
  timestamp: number
}
