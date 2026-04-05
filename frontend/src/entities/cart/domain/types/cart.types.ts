import type { Card } from '@entities/card/domain/types'

export interface Postcard {
  LocalId: number
  price: string
  card: Card
}

export type CartAmount = {
  value: number
  currency: string
}

export type Cart = {
  items: Postcard[]
  amount: CartAmount
}

export interface PostcardsDaySummary {
  postcard: Postcard
  count: number
}
