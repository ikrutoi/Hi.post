import type { StoreAdapter } from './storeAdapter.types'
import type { CardtextTemplateItem } from '@cardtext/domain/types'
import type { Node as SlateNode } from 'slate'

/** Адаптер store "cardtext". Типы сущности — в @cardtext/domain/types. */
export interface CardtextAdapter extends StoreAdapter<CardtextTemplateItem> {
  addUniqueRecord(nodes: SlateNode[]): Promise<void>
}
