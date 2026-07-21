import type {
  CalendarViewDate,
  MonthDirection,
} from '@entities/date/domain/types'

/** Сдвиг месяца для сетки календаря. `month` — 0-based (0–11), как в `Date` / Redux. */
export const shiftMonth = (
  calendarViewDate: CalendarViewDate,
  direction: MonthDirection,
): CalendarViewDate => {
  let { year, month } = calendarViewDate

  if (direction === 'before') {
    if (month === 0) {
      month = 11
      year -= 1
    } else {
      month -= 1
    }
  } else if (direction === 'after') {
    if (month === 11) {
      month = 0
      year += 1
    } else {
      month += 1
    }
  }

  return { year, month }
}
