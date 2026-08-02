/**
 * Режимы полосы календаря:
 * - `date` — сборка / обычная дата
 * - `cart` — календарь корзины (навигация по открыткам)
 * - `history` — история
 * - `unblocked` — смена даты cartBlocked: внешне как `date`, контекст корзины
 */
export type DateStripSection = 'date' | 'history' | 'cart' | 'unblocked'
