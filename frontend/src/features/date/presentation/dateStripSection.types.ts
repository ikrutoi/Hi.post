/**
 * Режимы полосы календаря:
 * - `date` — сборка / обычная дата
 * - `cart` — календарь корзины (навигация по открыткам)
 * - `history` — история
 * - `cartdate` — смена даты открытки из корзины (chrome как `date`, контекст корзины):
 *   ветка active `cart` и ветка `cartBlocked` / order-disabled.
 */
export type DateStripSection = 'date' | 'history' | 'cart' | 'cartdate'

/** Ветка режима `cartdate`: обычная корзина vs заблокированная / просроченная. */
export type CartdateBranch = 'cart' | 'cartBlocked'
