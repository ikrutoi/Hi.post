import { CalendarViewDate } from '../domain/types'

export const isDisabledDate = (
  day: number,
  calendarViewDate: CalendarViewDate,
  currentDate: {
    day: number
    month: number
    year: number
  }
): boolean => {
  if (!calendarViewDate) return false

  const { year, month } = calendarViewDate

  return (
    (month === currentDate.month &&
      year === currentDate.year &&
      day <= currentDate.day + 5) ||
    year < currentDate.year ||
    (year === currentDate.year && month < currentDate.month)
  )
}
