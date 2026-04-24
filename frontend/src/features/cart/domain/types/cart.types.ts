import type { Postcard } from '@entities/postcard'

export type CartAmount = {
  value: number
  currency: string
}

export type Cart = {
  items: Postcard[]
  amount: CartAmount
  isActive: boolean
  /** Выбранная строка списка корзины (превью пирога справа). */
  listSelectedLocalId: number | null
}
