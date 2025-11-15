import { CalendarViewDate } from '../domain/types'
import { currentDate } from '@features/date/calendar/domain/models'

export const isDisabledDate = (
  day: number,
  calendarViewDate: CalendarViewDate,
  currentDate: {
    currentDay: number
    currentMonth: number
    currentYear: number
  }
): boolean => {
  if (!calendarViewDate) return false

  const { year, month } = calendarViewDate

  return (
    (month === currentDate.currentMonth &&
      year === currentDate.currentYear &&
      day <= currentDate.currentDay + 5) ||
    year < currentDate.currentYear ||
    (year === currentDate.currentYear && month < currentDate.currentMonth)
  )
}
