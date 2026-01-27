import type { ImageTemplateItem } from '@/features/cardphoto/domain/typesLayout'
import type { CardtextTemplateItem } from '@cardtext/domain/types'
import type { CardtextRecord } from '../types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { SentItem } from '@entities/sent/domain/types'
import type { ImageMeta, WorkingConfig } from '@cardphoto/domain/types'

export interface StoreMap {
  stockImages: ImageMeta
  userImages: ImageMeta & { id: string }
  cropImages: ImageMeta & { id: string }
  cardtext: CardtextRecord
  sender: AddressTemplateItem
  recipient: AddressTemplateItem
  cart: CartItem
  drafts: DraftsItem
  sent: SentItem
}
// export interface TemplateStoreMap {
//   stockImages: ImageMeta[]
//   userImages: ImageMeta[]
//   cropImages: ImageMeta[]
//   cardtext: CardtextTemplateItem[]
//   sender: AddressTemplateItem[]
//   recipient: AddressTemplateItem[]
//   cart: CartItem[]
//   drafts: DraftsItem[]
//   sent: SentItem[]
// }
