import { CardtextStyle, CardtextValue } from '@/features/cardtext/domain/types'
import type { StoreAdapter } from './storeAdapter.types'
import type { Node as SlateNode } from 'slate'

export interface CardtextRecord {
  id: string
  value: CardtextValue
  title: string
  style: CardtextStyle
  plainText: string
  cardtextLines: number
  applied: string | null
}

export interface CardtextAdapter extends StoreAdapter<CardtextRecord> {
  addUniqueRecord(text: SlateNode[]): Promise<void>
}
