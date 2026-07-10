import type { PostcardHydrated } from '@entities/postcard'

export type CartAmount = {
  value: number
  currency: string
}

/** Сегмент списка корзины: обычная корзина / заблокированные даты. */
export type CartListStatusSegment = 'cart' | 'cartBlocked'

export type CartListSelectedLocalIdsBySegment = Record<
  CartListStatusSegment,
  number | null
>

export type Cart = {
  items: PostcardHydrated[]
  amount: CartAmount
  isActive: boolean
  /** Выбранная строка списка корзины по сегменту (превью пирога справа). */
  listSelectedLocalIdsBySegment: CartListSelectedLocalIdsBySegment
  /**
   * Пользователь включил верхний ряд cardPieCopy (копирование секций из строки списка в сессию).
   * Фактический «активный» UI ещё зависит от выбранной строки и размера карты (см. `showTopCardStripFullSpan` в App).
   */
  cardPieCopyStripExpanded: boolean
  /** Кнопки «корзина / заблокированные» под шапкой `CartListPanel`. */
  listStatusSegment: CartListStatusSegment
  /** Отмеченные чекбоксом строки сегмента «Корзина» (`localId`). */
  listCheckedLocalIds: number[]
}
