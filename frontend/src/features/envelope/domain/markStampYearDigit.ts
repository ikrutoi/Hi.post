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
 * `null` — дата ещё не выбрана (или только placeholder): цифру на марке не показываем.
 * — не более года (включительно) → 1
 * — больше года, не более двух → 2
 * — …
 * — от 100 лет и дольше → 100 (отдельная готовая марка `mark_os_ready_100.svg`, без оверлея цифр).
 */
export function markStampYearCountFromDispatch(
  now: Date,
  dispatch: DispatchDate | null,
): number | null {
  if (dispatch == null) return null
  if (
    dispatch.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    dispatch.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    dispatch.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  ) {
    return null
  }

  const dispatchAt = dispatchDateToLocalCalendarDate(dispatch).getTime()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const spanMs = dispatchAt - today
  if (spanMs <= 0) return 1

  const spanYears = spanMs / MS_PER_YEAR
  const step = Math.max(1, Math.ceil(spanYears))
  if (step >= 100) return 100
  return Math.min(99, step)
}
