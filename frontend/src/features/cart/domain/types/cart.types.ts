import type { Postcard } from '@entities/postcard'

export type CartAmount = {
  value: number
  currency: string
}

export type Cart = {
  items: Postcard[]
  amount: CartAmount
  isActive: boolean
}
