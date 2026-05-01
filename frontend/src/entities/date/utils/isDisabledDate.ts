import type { CalendarViewDate, DispatchDate } from '../domain/types'

export type OrderCalendarCurrentDate = {
  year: number
  month: number
  day: number
}

export function isDispatchDateDisabledForOrder(
  d: DispatchDate,
  currentDate: OrderCalendarCurrentDate,
): boolean {
  return isDisabledDate(d.day, { year: d.year, month: d.month }, currentDate)
}

export const isDisabledDate = (
  day: number,
  calendarViewDate: CalendarViewDate,
  currentDate: OrderCalendarCurrentDate,
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
