import { CardtextStyle, CardtextValue } from '@/features/cardtext/domain/types'
import type { StoreAdapter } from './storeAdapter.types'
import type { Node as SlateNode } from 'slate'

export interface CardtextRecord {
  id: string
  value: CardtextValue
  style: CardtextStyle
  plainText: string
  cardtextLines: number
}

export interface CardtextAdapter extends StoreAdapter<CardtextRecord> {
  addUniqueRecord(text: SlateNode[]): Promise<void>
}
