import type { CardItem } from '@entities/card/domain/types'

export interface DraftsItemMeta {
  comment?: string
  source?: 'user' | 'system'
  tags?: string[]
  [key: string]: unknown
}
export interface DraftsItem {
  LocalId: number
  card: CardItem
  meta?: DraftsItemMeta
}

export type DraftsState = DraftsItem[]
