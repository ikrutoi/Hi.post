import type { DispatchDate } from '@entities/date/domain/types'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'

const MS_PER_DAY = 86_400_000
/** Средний год для полосы «до N лет» (как в календарных оценках срока). */
const MS_PER_YEAR = 365.25 * MS_PER_DAY

export function dispatchDateToLocalCalendarDate(d: DispatchDate): Date {
  return new Date(d.year, d.month - 1, d.day)
}

/**
 * Число на марке (1…99) по сроку до даты отправления от «сегодня» (локальный календарный день).
 * — не более года (включительно) → 1
 * — больше года, не более двух → 2
 * — …
 * — более 99 лет → 99 (отдельная марка «100» не входит в этот расчёт).
 */
export function markStampYearCountFromDispatch(
  now: Date,
  dispatch: DispatchDate | null,
): number {
  if (dispatch == null) return 1
  if (
    dispatch.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    dispatch.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    dispatch.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  ) {
    return 1
  }

  const dispatchAt = dispatchDateToLocalCalendarDate(dispatch).getTime()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const spanMs = dispatchAt - today
  if (spanMs <= 0) return 1

  const spanYears = spanMs / MS_PER_YEAR
  const step = Math.max(1, Math.ceil(spanYears))
  return Math.min(99, step)
}
