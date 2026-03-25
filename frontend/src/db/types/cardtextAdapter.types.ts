import type { StoreAdapter } from './storeAdapter.types'
import type { CardtextContent } from '@cardtext/domain/types'

/** Nodes are Slate nodes; typed as unknown[] here to avoid importing slate in db/types (prevents 500 when loading templateService). */
export interface CardtextAdapter extends StoreAdapter<CardtextContent> {
  addUniqueRecord(nodes: unknown[]): Promise<void>
}
