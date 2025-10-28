import type { StoreAdapter } from '../../types/storeAdapter.types'
import type { ImageTemplateItem } from '@cardphoto/domain/types'
import type { CardtextTemplateItem } from '@cardtext/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { SentItem } from '@entities/sent/domain/types'

export interface StockImagesAdapter extends StoreAdapter<ImageTemplateItem> {}

export interface UserImagesAdapter extends StoreAdapter<ImageTemplateItem> {}

export interface CardtextTemplatesAdapter
  extends StoreAdapter<CardtextTemplateItem> {
  addTemplate(template: CardtextTemplateItem): Promise<void>
}

export interface SenderTemplatesAdapter
  extends StoreAdapter<AddressTemplateItem> {
  addUniqueRecord(payload: Omit<AddressTemplateItem, 'localId'>): Promise<void>
}

export interface RecipientTemplatesAdapter
  extends StoreAdapter<AddressTemplateItem> {
  addUniqueRecord(payload: Omit<AddressTemplateItem, 'localId'>): Promise<void>
}

export interface CartTemplatesAdapter extends StoreAdapter<CartItem> {}

export interface DraftsTemplatesAdapter extends StoreAdapter<DraftsItem> {}

export interface SentTemplatesAdapter extends StoreAdapter<SentItem> {}
