import { DispatchDate } from '../domain/types'
import { currentDate } from '@features/date/calendar/domain/models'

export const isTabooDate = (
  day: number,
  selected: DispatchDate,
  current: typeof currentDate
): boolean => {
  if (!selected.isSelected) return false

  const { year, month } = selected

  return (
    (month === current.currentMonth &&
      year === current.currentYear &&
      day <= current.currentDay + 5) ||
    year < current.currentYear ||
    (year === current.currentYear && month < current.currentMonth)
  )
}
