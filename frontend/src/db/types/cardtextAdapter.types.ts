import type { StoreAdapter } from './storeAdapter.types'
import type { CardtextTemplateItemShape } from '@entities/templates/domain/types'

/** Nodes are Slate nodes; typed as unknown[] here to avoid importing slate in db/types (prevents 500 when loading templateService). */
export interface CardtextAdapter extends StoreAdapter<CardtextTemplateItemShape> {
  addUniqueRecord(nodes: unknown[]): Promise<void>
}
