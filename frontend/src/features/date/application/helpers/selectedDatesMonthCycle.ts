import type {
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'

function isPlaceholderDispatchDate(d: DispatchDate): boolean {
  return d.year === 0 && d.month === 0 && d.day === 0
}

function monthKey(m: CalendarViewDate): string {
  return `${m.year}-${m.month}`
}

/** Уникальные месяц+год выбранных дат, по календарному порядку. */
export function uniqueSelectedCalendarMonths(
  dates: readonly DispatchDate[],
): CalendarViewDate[] {
  const byKey = new Map<string, CalendarViewDate>()
  for (const d of dates) {
    if (isPlaceholderDispatchDate(d)) continue
    const view: CalendarViewDate = { year: d.year, month: d.month }
    const key = monthKey(view)
    if (!byKey.has(key)) byKey.set(key, view)
  }
  return [...byKey.values()].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month,
  )
}

/**
 * Следующий уникальный месяц+год с выбранными датами (цикл).
 * Если текущий вид не в списке — ближайший месяц после него, иначе первый.
 */
export function nextUniqueSelectedCalendarMonth(
  months: readonly CalendarViewDate[],
  current: CalendarViewDate,
): CalendarViewDate | null {
  if (months.length === 0) return null
  if (months.length === 1) {
    const only = months[0]!
    if (only.year === current.year && only.month === current.month) return null
    return only
  }

  const currentIndex = months.findIndex(
    (m) => m.year === current.year && m.month === current.month,
  )
  if (currentIndex >= 0) {
    return months[(currentIndex + 1) % months.length]!
  }

  const afterIndex = months.findIndex(
    (m) =>
      m.year > current.year ||
      (m.year === current.year && m.month > current.month),
  )
  return months[afterIndex >= 0 ? afterIndex : 0]!
}
