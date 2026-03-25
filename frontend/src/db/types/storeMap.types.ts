import type { CardtextTemplateItemShape } from '@entities/templates/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { Card } from '@entities/card/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { SentItem } from '@entities/sent/domain/types'
import type {
  ImageMeta,
  ImageRecord,
  WorkingConfig,
  ImageSource,
  CardphotoSessionRecord,
} from '@cardphoto/domain/types'
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
  cardtext: CardtextTemplateItemShape
  sender: AddressTemplateItem
  recipient: AddressTemplateItem
  cards: Card[]
  session: SessionData
  workingCard: WorkingCardRecord
  uiPreferences: UiPreferencesRecord
}

export interface TemplateStoreMap {
  stockImages: ImageRecord
  userImages: ImageRecord
  cardphotoImages: ImageMeta & { id: string }
  cardtext: CardtextTemplateItemShape
  sender: AddressTemplateItem
  recipient: AddressTemplateItem
  cart: CartItem
  drafts: DraftsItem
  sent: SentItem
}
