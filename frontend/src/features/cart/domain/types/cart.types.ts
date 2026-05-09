import type { PostcardHydrated } from '@entities/postcard'

export type CartAmount = {
  value: number
  currency: string
}

/** Сегмент списка корзины: обычная корзина / заблокированные даты. */
export type CartListStatusSegment = 'cart' | 'cartBlocked'

export type Cart = {
  items: PostcardHydrated[]
  amount: CartAmount
  isActive: boolean
  /** Выбранная строка списка корзины (превью пирога справа). */
  listSelectedLocalId: number | null
  /**
   * Пользователь включил верхний ряд cardPieCopy (копирование секций из строки списка в сессию).
   * Фактический «активный» UI ещё зависит от выбранной строки и размера карты (см. `showTopCardStripFullSpan` в App).
   */
  cardPieCopyStripExpanded: boolean
  /** Кнопки «корзина / заблокированные» под шапкой `CartListPanel`. */
  listStatusSegment: CartListStatusSegment
}
