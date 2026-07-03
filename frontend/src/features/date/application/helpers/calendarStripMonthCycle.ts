import type {
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'
import type { PostcardHydrated } from '@entities/postcard'

export type CartStripMonthCycleStatus = 'cart' | 'cartBlocked'

export type HistoryStripMonthCycleStatus =
  | 'ready'
  | 'sent'
  | 'delivered'
  | 'error'

export type StripMonthCycleStatus =
  | CartStripMonthCycleStatus
  | HistoryStripMonthCycleStatus

function dispatchDateSortTimestamp(d: DispatchDate): number {
  if (d.year === 0 && d.month === 0 && d.day === 0) {
    return Number.POSITIVE_INFINITY
  }
  return new Date(d.year, d.month, d.day).getTime()
}

function compareByDispatchDate(
  a: PostcardHydrated,
  b: PostcardHydrated,
): number {
  const timeDelta =
    dispatchDateSortTimestamp(a.date) - dispatchDateSortTimestamp(b.date)
  if (timeDelta !== 0) return timeDelta
  return a.localId - b.localId
}

/** Порядок как в списке: раньше по дате отправки, затем `localId`. */
export function orderedStripPostcardsByDispatchDate(
  cartItems: readonly PostcardHydrated[],
  status: StripMonthCycleStatus,
): PostcardHydrated[] {
  return cartItems
    .filter((item) => item.status === status)
    .slice()
    .sort(compareByDispatchDate)
}

export function calendarMonthAtStripCycleIndex(
  items: readonly { date: DispatchDate }[],
  cycleIndex: number,
): CalendarViewDate | null {
  if (items.length === 0) return null
  const safeIndex =
    ((cycleIndex % items.length) + items.length) % items.length
  const date = items[safeIndex]!.date
  return { year: date.year, month: date.month }
}

export function nextStripMonthCycleIndex(
  cycleIndex: number,
  itemCount: number,
): number {
  if (itemCount <= 0) return 0
  return (cycleIndex + 1) % itemCount
}
