import type { CardtextContent } from '@cardtext/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { Postcard } from '@entities/postcard'
import type { ImageMeta, ImageRecord } from '@cardphoto/domain/types'
import type { SessionData } from '@entities/db/domain/types'
import type { WorkingCardRecord } from '@entities/card/domain/types'
import type { CardphotoListTemplateGridCols } from '@cardphoto/infrastructure/state/cardphotoUiSlice'

export interface UiPreferencesRecord {
  id: 'cardphotoList'
  cardphotoListTemplateGridCols: CardphotoListTemplateGridCols
}

export interface StoreMap {
  stockImages: ImageRecord
  userImages: ImageRecord
  cardphotoImages: ImageMeta & { id: string }
  applyImage: ImageRecord
  cardtext: CardtextContent
  sender: AddressTemplateItem
  recipient: AddressTemplateItem
  postcards: Postcard
  session: SessionData
  workingCard: WorkingCardRecord
  uiPreferences: UiPreferencesRecord
}

