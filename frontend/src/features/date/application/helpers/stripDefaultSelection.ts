import type { RootState } from '@app/state'
import type {
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatus } from '@entities/postcard/domain/types'
import type { CartListStatusSegment } from '@cart/domain/types'
import {
  selectCartItems,
  selectCartListSelectedLocalId,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import { orderedStripPostcardsByDispatchDate } from '@date/application/helpers/calendarStripMonthCycle'
import {
  selectCartCalendarDatePickMode,
  selectHistoryListSelectedLocalId,
} from '@date/calendar/infrastructure/selectors'
import { isHistoryListSelectedLocalIdInSortedList } from '@date/application/helpers/historyListPanelEntries'
import { getCurrentDate } from '@shared/utils/date'

/** Приоритет выбора открытки в strip «История» (цикл по статусу в календаре). */
export const HISTORY_STRIP_STATUS_PRIORITY = [
  'cart',
  'ready',
  'sent',
  'delivered',
  'error',
] as const satisfies readonly PostcardStatus[]

export type HistoryStripDefaultSelectionStatus =
  (typeof HISTORY_STRIP_STATUS_PRIORITY)[number]

function dispatchDateMs(d: DispatchDate): number | null {
  if (d.year === 0 && d.month === 0 && d.day === 0) return null
  return new Date(d.year, d.month, d.day).getTime()
}

/**
 * Ближайшая к `today` по дате отправки.
 * При равной дистанции — будущая раньше прошлой; затем меньший `localId`.
 */
export function resolveNearestPostcardByDispatchDate(
  items: readonly PostcardHydrated[],
  today: Pick<DispatchDate, 'year' | 'month' | 'day'> = getCurrentDate(),
): PostcardHydrated | null {
  const todayMs = new Date(today.year, today.month, today.day).getTime()
  let best: PostcardHydrated | null = null
  let bestAbs = Number.POSITIVE_INFINITY
  let bestSigned = 0

  for (const item of items) {
    const ms = dispatchDateMs(item.date)
    if (ms == null) continue
    const signed = ms - todayMs
    const abs = Math.abs(signed)
    if (
      best == null ||
      abs < bestAbs ||
      (abs === bestAbs &&
        ((signed >= 0 && bestSigned < 0) ||
          ((signed >= 0) === (bestSigned >= 0) &&
            item.localId < best.localId)))
    ) {
      best = item
      bestAbs = abs
      bestSigned = signed
    }
  }

  if (best != null) return best
  if (items.length === 0) return null
  return items.reduce((a, b) => (a.localId <= b.localId ? a : b))
}

/**
 * Ближайшая по времени открытка в корзине; если пусто — среди заблокированных.
 * Используется при первом фокусе (ещё не выбирали / выбор невалиден).
 */
export function resolveDefaultCartStripPostcard(
  cartItems: readonly PostcardHydrated[],
  today: Pick<DispatchDate, 'year' | 'month' | 'day'> = getCurrentDate(),
): PostcardHydrated | null {
  const cartPostcards = cartItems.filter((item) => item.status === 'cart')
  const nearestCart = resolveNearestPostcardByDispatchDate(cartPostcards, today)
  if (nearestCart != null) return nearestCart

  const blockedPostcards = cartItems.filter(
    (item) => item.status === 'cartBlocked',
  )
  return resolveNearestPostcardByDispatchDate(blockedPostcards, today)
}

export function isCartListSelectedLocalIdSaved(
  localId: number | null,
  cartItems: readonly PostcardHydrated[],
): boolean {
  if (localId == null) return false
  return cartItems.some((item) => item.localId === localId)
}

export function isCartSegmentSelectedLocalIdSaved(
  localId: number | null,
  cartItems: readonly PostcardHydrated[],
  segment: CartListStatusSegment,
): boolean {
  if (localId == null) return false
  return cartItems.some(
    (item) => item.localId === localId && item.status === segment,
  )
}

/** Первая строка сегмента — тот же порядок, что в списке корзины. */
export function resolveFirstCartSegmentPostcard(
  cartItems: readonly PostcardHydrated[],
  segment: CartListStatusSegment,
): PostcardHydrated | null {
  return orderedStripPostcardsByDispatchDate(cartItems, segment)[0] ?? null
}

export function resolveDefaultCartSegmentPostcard(
  cartItems: readonly PostcardHydrated[],
  segment: CartListStatusSegment,
  today: Pick<DispatchDate, 'year' | 'month' | 'day'> = getCurrentDate(),
): PostcardHydrated | null {
  if (segment === 'cartBlocked') {
    return resolveFirstCartSegmentPostcard(cartItems, 'cartBlocked')
  }
  return resolveDefaultCartStripPostcard(cartItems, today)
}

/** Первый вход в текущий сегмент списка или выбор в нём невалиден. */
export function shouldApplyCartStripDefaultSelection(state: RootState): boolean {
  if (selectCartCalendarDatePickMode(state)) return false

  const segment = selectCartListStatusSegment(state)
  const localId = selectCartListSelectedLocalId(state)
  const cartItems = selectCartItems(state)
  return !isCartSegmentSelectedLocalIdSaved(localId, cartItems, segment)
}

/** Первый вход в strip «История» или выбор не в текущем отсортированном списке. */
export function shouldApplyHistoryStripDefaultSelection(
  state: RootState,
): boolean {
  const localId = selectHistoryListSelectedLocalId(state)
  return !isHistoryListSelectedLocalIdInSortedList(localId, state)
}

export function calendarViewDateForPostcard(
  postcard: PostcardHydrated,
): CalendarViewDate {
  return { year: postcard.date.year, month: postcard.date.month }
}
