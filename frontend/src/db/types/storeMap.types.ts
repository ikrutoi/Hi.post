import type { ImageTemplateItem } from '@cardphoto/domain/types'
import type { CardtextTemplateItem } from '@cardtext/domain/types'
import type { CardtextRecord } from '../types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { SentItem } from '@entities/sent/domain/types'

export interface StoreMap {
  stockImages: ImageTemplateItem
  userImages: ImageTemplateItem
  cardtext: CardtextRecord
  sender: AddressTemplateItem
  recipient: AddressTemplateItem
  cart: CartItem
  drafts: DraftsItem
  sent: SentItem
}
export interface TemplateStoreMap {
  stockImages: ImageTemplateItem[]
  userImages: ImageTemplateItem[]
  cardtext: CardtextTemplateItem[]
  sender: AddressTemplateItem[]
  recipient: AddressTemplateItem[]
  cart: CartItem[]
  drafts: DraftsItem[]
  sent: SentItem[]
}
