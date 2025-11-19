import type { CalendarViewDate, Switcher } from '@entities/date/domain/types'

export const getFlashPartsForDateChange = (
  from: CalendarViewDate,
  to: CalendarViewDate
): Switcher[] => {
  const parts: Switcher[] = []

  if (from.year !== to.year) {
    parts.push('year', 'month')
    return parts
  }

  if (from.month !== to.month) {
    parts.push('month')
  }

  return parts
}
