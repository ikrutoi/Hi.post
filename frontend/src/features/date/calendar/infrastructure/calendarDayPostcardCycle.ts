import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@entities/postcard/domain/types'
import type { PostcardStatus } from '@entities/postcard/domain/types'
import type { CartListStatusSegment } from '@cart/domain/types'
import { flattenOpenDayPanelItems } from '@date/infrastructure/selectors/dateSelectors'
import { postcardLocalIdFromCalendarCardItem } from './postcardLocalIdFromCalendarCardItem'

const HISTORY_DAY_STATUS_ORDER = [
  'cart',
  'cartBlocked',
  'ready',
  'sent',
  'delivered',
  'error',
] as const satisfies readonly PostcardStatus[]

export function dispatchDateKeyFromPostcard(
  postcard: Pick<PostcardHydrated, 'date'>,
): string {
  const { year, month, day } = postcard.date
  return `${year}-${month}-${day}`
}

/** Порядок как в Redux `cart.items` — без парсинга `rowKey`. */
export function orderedCartLocalIdsForDispatchDateKey(
  cartItems: readonly PostcardHydrated[],
  dateKey: string,
  statusFilter?: CartListStatusSegment,
): number[] {
  const lids: number[] = []
  const seen = new Set<number>()
  for (const item of cartItems) {
    if (dispatchDateKeyFromPostcard(item) !== dateKey) continue
    if (statusFilter != null && item.status !== statusFilter) continue
    if (seen.has(item.localId)) continue
    seen.add(item.localId)
    lids.push(item.localId)
  }
  return lids
}

/** Порядок как у панели дня / легенды, напрямую из `cart.items`. */
export function orderedHistoryLocalIdsForDispatchDateKey(
  cartItems: readonly PostcardHydrated[],
  dateKey: string,
  postcardStatuses: PostcardStatuses,
): number[] {
  const lids: number[] = []
  const seen = new Set<number>()
  for (const status of HISTORY_DAY_STATUS_ORDER) {
    if (!postcardStatuses[status]) continue
    for (const item of cartItems) {
      if (dispatchDateKeyFromPostcard(item) !== dateKey) continue
      if (item.status !== status) continue
      if (seen.has(item.localId)) continue
      seen.add(item.localId)
      lids.push(item.localId)
    }
  }
  return lids
}

function mergeUniqueLocalIds(
  primary: readonly number[],
  fallback: readonly number[],
): number[] {
  const lids: number[] = []
  const seen = new Set<number>()
  for (const lid of [...primary, ...fallback]) {
    if (seen.has(lid)) continue
    seen.add(lid)
    lids.push(lid)
  }
  return lids
}

/** Полоса «Корзина»: порядок `dayData.cart` → `localId` (без дублей). */
export function orderedCartStripLocalIdsForDay(
  dayData: CardCalendarIndex,
  cartItems: readonly PostcardHydrated[],
  statusFilter?: CartListStatusSegment,
  dateKey?: string,
): number[] {
  const fromCartItems =
    dateKey != null
      ? orderedCartLocalIdsForDispatchDateKey(
          cartItems,
          dateKey,
          statusFilter,
        )
      : []

  const lids: number[] = []
  const seen = new Set<number>()
  for (const item of dayData.cart) {
    if (statusFilter != null && item.status !== statusFilter) continue
    const lid = postcardLocalIdFromCalendarCardItem(item, cartItems)
    if (lid == null || seen.has(lid)) continue
    seen.add(lid)
    lids.push(lid)
  }

  return mergeUniqueLocalIds(fromCartItems, lids)
}

/** Секция «История»: порядок как у панели дня / легенды (`flattenOpenDayPanelItems` + фильтр статусов). */
export function orderedHistoryDayLocalIds(
  dayData: CardCalendarIndex,
  cartItems: readonly PostcardHydrated[],
  postcardStatuses: PostcardStatuses,
  dateKey?: string,
): number[] {
  const fromCartItems =
    dateKey != null
      ? orderedHistoryLocalIdsForDispatchDateKey(
          cartItems,
          dateKey,
          postcardStatuses,
        )
      : []

  const lids: number[] = []
  const seen = new Set<number>()
  for (const item of flattenOpenDayPanelItems(dayData)) {
    if (!postcardStatuses[item.status]) continue
    const lid = postcardLocalIdFromCalendarCardItem(item, cartItems)
    if (lid == null || seen.has(lid)) continue
    seen.add(lid)
    lids.push(lid)
  }

  return mergeUniqueLocalIds(fromCartItems, lids)
}

/** Следующий `localId` в цикле; `current` вне списка включается в цикл. */
export function nextCyclicLocalId(
  orderedLocalIds: number[],
  current: number | null,
): number | null {
  if (orderedLocalIds.length === 0) return null

  let lids = [...new Set(orderedLocalIds)]
  if (current != null && !lids.includes(current)) {
    lids = [...lids, current].sort((a, b) => a - b)
  }

  if (lids.length === 1) {
    return lids[0] === current ? null : lids[0] ?? null
  }

  const idx = current != null ? lids.indexOf(current) : -1
  const nextIdx = idx < 0 ? 0 : (idx + 1) % lids.length
  return lids[nextIdx] ?? null
}
