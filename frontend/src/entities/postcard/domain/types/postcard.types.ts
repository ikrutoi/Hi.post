import type { Card } from '@entities/card/domain/types'

export interface Postcard {
  LocalId: number
  price: string
  card: Card
}

export interface PostcardsDaySummary {
  postcard: Postcard
  count: number
}
