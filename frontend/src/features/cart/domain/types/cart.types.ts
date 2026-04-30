import type { PostcardHydrated } from '@entities/postcard'

export type CartAmount = {
  value: number
  currency: string
}

export type Cart = {
  items: PostcardHydrated[]
  amount: CartAmount
  isActive: boolean
  /** Выбранная строка списка корзины (превью пирога справа). */
  listSelectedLocalId: number | null
}
