import type { StoreAdapter } from '../../types/storeAdapter.types'
import type { CardtextContent } from '@cardtext/domain/types'
import type { AddressTemplateItem } from '@entities/envelope/domain/types'
import type { Postcard } from '@entities/postcard'
import type { DraftsItem } from '@entities/drafts/domain/types'
import type { SentItem } from '@entities/sent/domain/types'

export interface CardtextTemplatesAdapter extends StoreAdapter<CardtextContent> {
  addTemplate(template: CardtextContent): Promise<void>
}

export interface SenderTemplatesAdapter extends StoreAdapter<AddressTemplateItem> {
  addUniqueRecord(payload: Omit<AddressTemplateItem, 'localId'>): Promise<void>
}

export interface RecipientTemplatesAdapter extends StoreAdapter<AddressTemplateItem> {
  addUniqueRecord(payload: Omit<AddressTemplateItem, 'localId'>): Promise<void>
}

export interface CartTemplatesAdapter extends StoreAdapter<Postcard> {}

export interface DraftsTemplatesAdapter extends StoreAdapter<DraftsItem> {}

export interface SentTemplatesAdapter extends StoreAdapter<SentItem> {}
