import type { CardPanelSection } from './cardPanel.types'
import type { ImageMeta } from '@cardphoto/domain/types'
import type { CardtextEditorSessionSnapshot } from '@cardtext/domain/editor/editor.types'
import type { SenderState } from '@envelope/sender/domain/types'
import type { RecipientState } from '@envelope/recipient/domain/types'
import type { AromaItem } from '@entities/aroma/domain/types'
import type { DispatchDate } from '@entities/date/domain/types'

export type MirrorSectionBackup =
  | {
      section: 'cardphoto'
      /** Session Apply — drives pie/assembly completeness. */
      appliedData: ImageMeta | null
      /** View/create preview without Apply — must not be promoted on restore. */
      assetData: ImageMeta | null
    }
  | { section: 'cardtext'; session: CardtextEditorSessionSnapshot }
  | { section: 'envelope'; sender: SenderState; recipient: RecipientState }
  | { section: 'aroma'; aroma: AromaItem | null }
  | {
      section: 'date'
      dates: DispatchDate[]
      isMultiDateMode: boolean
    }

export type MirrorSectionBackupState = {
  bySection: Partial<Record<CardPanelSection, MirrorSectionBackup>>
}
