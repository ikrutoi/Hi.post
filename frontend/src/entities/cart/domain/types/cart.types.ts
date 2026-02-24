import type { Card } from '@entities/card/domain/types'

export interface CartItemMeta {
  comment?: string
  source?: 'user' | 'system'
  tags?: string[]
  replicaGroupId?: string | null
  [key: string]: unknown
}
export interface CartItem {
  LocalId: number
  price: string
  card: Card
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
