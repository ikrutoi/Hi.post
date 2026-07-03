import type { RootState } from '@app/state'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatus } from '@entities/postcard/domain/types'
import {
  selectCartItems,
  selectCartListSelectedLocalId,
} from '@cart/infrastructure/selectors'
import {
  selectCartCalendarDatePickMode,
  selectHistoryListSelectedLocalId,
} from '@date/calendar/infrastructure/selectors'
import { orderedStripPostcardsByDispatchDate } from './calendarStripMonthCycle'

/** Приоритет выбора открытки в strip «История». */
export const HISTORY_STRIP_STATUS_PRIORITY = [
  'cart',
  'ready',
  'sent',
  'delivered',
  'error',
] as const satisfies readonly PostcardStatus[]

export type HistoryStripDefaultSelectionStatus =
  (typeof HISTORY_STRIP_STATUS_PRIORITY)[number]

/** Первая открытка в корзине; если корзина пуста — первая заблокированная. */
export function resolveDefaultCartStripPostcard(
  cartItems: readonly PostcardHydrated[],
): PostcardHydrated | null {
  const cartPostcards = orderedStripPostcardsByDispatchDate(cartItems, 'cart')
  if (cartPostcards.length > 0) return cartPostcards[0]!

  const blockedPostcards = orderedStripPostcardsByDispatchDate(
    cartItems,
    'cartBlocked',
  )
  if (blockedPostcards.length > 0) return blockedPostcards[0]!

  return null
}

/** Первая открытка по приоритету статусов для strip «История». */
export function resolveDefaultHistoryStripPostcard(
  cartItems: readonly PostcardHydrated[],
): PostcardHydrated | null {
  for (const status of HISTORY_STRIP_STATUS_PRIORITY) {
    const items = orderedStripPostcardsByDispatchDate(cartItems, status)
    if (items.length > 0) return items[0]!
  }
  return null
}

export function isCartListSelectedLocalIdSaved(
  localId: number | null,
  cartItems: readonly PostcardHydrated[],
): boolean {
  if (localId == null) return false
  return cartItems.some((item) => item.localId === localId)
}

export function isHistoryListSelectedLocalIdSaved(
  localId: number | null,
  cartItems: readonly PostcardHydrated[],
): boolean {
  if (localId == null) return false
  const postcard = cartItems.find((item) => item.localId === localId)
  if (postcard == null) return false
  return (HISTORY_STRIP_STATUS_PRIORITY as readonly PostcardStatus[]).includes(
    postcard.status,
  )
}

/** Первый вход в strip «Корзина» или выбор указывает на несуществующую открытку. */
export function shouldApplyCartStripDefaultSelection(state: RootState): boolean {
  if (selectCartCalendarDatePickMode(state)) return false

  const localId = selectCartListSelectedLocalId(state)
  const cartItems = selectCartItems(state)
  return !isCartListSelectedLocalIdSaved(localId, cartItems)
}

/** Первый вход в strip «История» или выбор не из допустимых статусов. */
export function shouldApplyHistoryStripDefaultSelection(
  state: RootState,
): boolean {
  const localId = selectHistoryListSelectedLocalId(state)
  const cartItems = selectCartItems(state)
  return !isHistoryListSelectedLocalIdSaved(localId, cartItems)
}

export function calendarViewDateForPostcard(
  postcard: PostcardHydrated,
): CalendarViewDate {
  return { year: postcard.date.year, month: postcard.date.month }
}
