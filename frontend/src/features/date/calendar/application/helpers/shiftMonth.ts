import type {
  CalendarViewDate,
  MonthDirection,
} from '@entities/date/domain/types'

export const shiftMonth = (
  calendarViewDate: CalendarViewDate,
  direction: MonthDirection
): CalendarViewDate => {
  let { year, month } = calendarViewDate

  if (direction === 'before') {
    month -= 1
    if (month === 0) {
      month = 12
      year -= 1
    }
  } else if (direction === 'after') {
    month += 1
    if (month === 13) {
      month = 1
      year += 1
    }
  }

  return { year, month }
}
