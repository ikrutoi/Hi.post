import type { CardSaved } from '@entities/card/domain/types'

export interface CartItemMeta {
  comment?: string
  source?: 'user' | 'system'
  tags?: string[]
  [key: string]: unknown
}
export interface CartItem {
  LocalId: number
  price: string
  card: CardSaved
  meta?: CartItemMeta
}

export type CartAmount = {
  value: number
  currency: string
}

export type Cart = {
  items: CartItem[]
  amount: CartAmount
}

export interface CartDayInfo {
  item: CartItem
  count: number
}
