import type { ImageTemplateItem } from '@/features/cardphoto/domain/typesLayout'
import type { CardtextTemplateItem } from './cardtextAdapter.types'
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

export interface StoreMap {
  stockImages: ImageRecord
  userImages: ImageRecord
  cropImages: ImageMeta & { id: string }
  applyImage: ImageRecord
  cardtext: CardtextTemplateItem
  sender: AddressTemplateItem
  recipient: AddressTemplateItem
  cards: Card[]
  session: SessionData
  workingCard: WorkingCardRecord
}

export interface TemplateStoreMap {
  stockImages: ImageRecord
  userImages: ImageRecord
  cropImages: ImageMeta & { id: string }
  cardtext: CardtextTemplateItem
  sender: AddressTemplateItem
  recipient: AddressTemplateItem
  cart: CartItem
  drafts: DraftsItem
  sent: SentItem
}
