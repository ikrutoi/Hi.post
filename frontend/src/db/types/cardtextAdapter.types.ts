import type { StoreAdapter } from './storeAdapter.types'
import type { Node as SlateNode } from 'slate'

export interface CardtextAdapter
  extends StoreAdapter<{ id: number; text: SlateNode[] }> {
  addUniqueRecord(text: SlateNode[]): Promise<void>
}
