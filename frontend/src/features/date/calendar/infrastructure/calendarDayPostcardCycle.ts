import type { CardCalendarIndex, CalendarCardItem } from '@entities/card/domain/types'
import type { DispatchDate } from '@entities/date/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@entities/postcard/domain/types'
import type { PostcardStatus } from '@entities/postcard/domain/types'
import type { CartListStatusSegment } from '@cart/domain/types'
import { postcardLocalIdFromCalendarCardItem } from './postcardLocalIdFromCalendarCardItem'

const HISTORY_DAY_STATUS_ORDER = [
  'cart',
  'cartBlocked',
  'ready',
  'sent',
  'delivered',
  'error',
] as const satisfies readonly PostcardStatus[]

/** История (календарь / strip): порядок статусов на одну дату отправки. */
export const HISTORY_CALENDAR_STATUS_ORDER = [
  'cart',
  'ready',
  'sent',
  'delivered',
  'error',
] as const satisfies readonly PostcardStatus[]

export function historyCalendarStatusSortIndex(status: PostcardStatus): number {
  const idx = (HISTORY_CALENDAR_STATUS_ORDER as readonly PostcardStatus[]).indexOf(
    status,
  )
  return idx >= 0 ? idx : Number.POSITIVE_INFINITY
}

function historyDayItemsForStatus(
  dayData: CardCalendarIndex,
  status: PostcardStatus,
): CalendarCardItem[] {
  switch (status) {
    case 'cart':
      return dayData.cart.filter((item) => item.status === 'cart')
    case 'cartBlocked':
      return dayData.cart.filter((item) => item.status === 'cartBlocked')
    case 'ready':
      return dayData.ready
    case 'sent':
      return dayData.sent
    case 'delivered':
      return dayData.delivered
    case 'error':
      return dayData.error
    default:
      return []
  }
}

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

/** Секция «История»: cart → ready → sent → delivered → error на каждый день. */
export function orderedHistoryDayLocalIds(
  dayData: CardCalendarIndex,
  cartItems: readonly PostcardHydrated[],
  postcardStatuses: PostcardStatuses,
  dateKey?: string,
): number[] {
  const lids: number[] = []
  const seen = new Set<number>()

  for (const status of HISTORY_CALENDAR_STATUS_ORDER) {
    if (!postcardStatuses[status]) continue

    if (dateKey != null) {
      for (const item of cartItems) {
        if (dispatchDateKeyFromPostcard(item) !== dateKey) continue
        if (item.status !== status) continue
        if (seen.has(item.localId)) continue
        seen.add(item.localId)
        lids.push(item.localId)
      }
    }

    for (const item of historyDayItemsForStatus(dayData, status)) {
      if (!postcardStatuses[item.status]) continue
      const lid = postcardLocalIdFromCalendarCardItem(item, cartItems)
      if (lid == null || seen.has(lid)) continue
      seen.add(lid)
      lids.push(lid)
    }
  }

  return lids
}

function dispatchDateSortTimestamp(d: DispatchDate): number {
  if (d.year === 0 && d.month === 0 && d.day === 0) {
    return Number.POSITIVE_INFINITY
  }
  return new Date(d.year, d.month, d.day).getTime()
}

function uniqueLocalIdsSortedByDispatchDateAndHistoryStatus(
  collected: readonly {
    localId: number
    date: DispatchDate
    status: PostcardStatus
  }[],
): number[] {
  const sorted = collected.slice().sort((a, b) => {
    const timeDelta =
      dispatchDateSortTimestamp(a.date) - dispatchDateSortTimestamp(b.date)
    if (timeDelta !== 0) return timeDelta
    const statusDelta =
      historyCalendarStatusSortIndex(a.status) -
      historyCalendarStatusSortIndex(b.status)
    if (statusDelta !== 0) return statusDelta
    return a.localId - b.localId
  })

  const lids: number[] = []
  const seen = new Set<number>()
  for (const item of sorted) {
    if (seen.has(item.localId)) continue
    seen.add(item.localId)
    lids.push(item.localId)
  }
  return lids
}

function uniqueLocalIdsSortedByDispatchDate(
  collected: readonly { localId: number; date: DispatchDate }[],
): number[] {
  const sorted = collected.slice().sort((a, b) => {
    const timeDelta =
      dispatchDateSortTimestamp(a.date) - dispatchDateSortTimestamp(b.date)
    if (timeDelta !== 0) return timeDelta
    return a.localId - b.localId
  })

  const lids: number[] = []
  const seen = new Set<number>()
  for (const item of sorted) {
    if (seen.has(item.localId)) continue
    seen.add(item.localId)
    lids.push(item.localId)
  }
  return lids
}

/** Все открытки strip «История»: по дате, на одну дату — cart → ready → sent → delivered → error. */
export function orderedHistoryCenterCycleLocalIds(
  cardsByDateMap: Record<string, CardCalendarIndex>,
  cartItems: readonly PostcardHydrated[],
  postcardStatuses: PostcardStatuses,
): number[] {
  const collected: {
    localId: number
    date: DispatchDate
    status: PostcardStatus
  }[] = []

  for (const status of HISTORY_CALENDAR_STATUS_ORDER) {
    if (!postcardStatuses[status]) continue
    for (const dayData of Object.values(cardsByDateMap)) {
      for (const item of historyDayItemsForStatus(dayData, status)) {
        const lid = postcardLocalIdFromCalendarCardItem(item, cartItems)
        if (lid == null) continue
        collected.push({ localId: lid, date: item.date, status: item.status })
      }
    }
  }

  return uniqueLocalIdsSortedByDispatchDateAndHistoryStatus(collected)
}

/** Все открытки сегмента strip «Корзина» по дате отправки (как на календаре). */
export function orderedCartCenterCycleLocalIds(
  cardsByDateMap: Record<string, CardCalendarIndex>,
  cartItems: readonly PostcardHydrated[],
  statusFilter: CartListStatusSegment,
): number[] {
  const collected: { localId: number; date: DispatchDate }[] = []
  for (const dayData of Object.values(cardsByDateMap)) {
    for (const item of dayData.cart) {
      if (statusFilter === 'cart' ? item.status !== 'cart' : item.status !== 'cartBlocked') {
        continue
      }
      const lid = postcardLocalIdFromCalendarCardItem(item, cartItems)
      if (lid == null) continue
      collected.push({ localId: lid, date: item.date })
    }
  }
  return uniqueLocalIdsSortedByDispatchDate(collected)
}

/** Сначала следующая открытка на том же дне, затем — по всему календарному списку. */
export function resolveDayThenGlobalPostcardCycle(input: {
  current: number | null
  dayLocalIds: readonly number[]
  globalLocalIds: readonly number[]
}): number | null {
  const { current, dayLocalIds, globalLocalIds } = input
  if (globalLocalIds.length <= 1) return null

  if (current != null && dayLocalIds.length > 1 && dayLocalIds.includes(current)) {
    const dayIdx = dayLocalIds.indexOf(current)
    if (dayIdx >= 0 && dayIdx < dayLocalIds.length - 1) {
      return dayLocalIds[dayIdx + 1] ?? null
    }
  }

  const globalIdx = current != null ? globalLocalIds.indexOf(current) : -1
  if (globalIdx >= 0 && globalIdx < globalLocalIds.length - 1) {
    return globalLocalIds[globalIdx + 1] ?? null
  }

  return null
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

/** Следующий `localId` без возврата к началу — для листания центрального CardPie. */
export function nextSequentialLocalId(
  orderedLocalIds: number[],
  current: number | null,
): number | null {
  if (orderedLocalIds.length === 0) return null

  const lids = [...new Set(orderedLocalIds)]
  if (lids.length === 1) {
    return lids[0] === current ? null : lids[0] ?? null
  }

  const idx = current != null ? lids.indexOf(current) : -1
  if (idx < 0) return null
  if (idx >= lids.length - 1) return null
  return lids[idx + 1] ?? null
}
