import type { StoreAdapter } from './storeAdapter.types'
import type { Node as SlateNode } from 'slate'

export interface CardtextRecord {
  localId: number
  text: SlateNode[]
}

export interface CardtextAdapter extends StoreAdapter<CardtextRecord> {
  addUniqueRecord(text: SlateNode[]): Promise<void>
}
