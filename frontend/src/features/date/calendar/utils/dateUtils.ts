import { DispatchDate } from '@entities/date/domain/dispatchDate'
import { isCompleteDate } from '@entities/date/utils/guard'

export const getDaysInPreviousMonth = (year: number, month: number): number => {
  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  return new Date(prevYear, prevMonth + 1, 0).getDate()
}

export const getDaysInCurrentMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

export const getFirstDayOfWeek = (
  startFrom: 'Sun' | 'Mon',
  year: number,
  month: number
): number => {
  const day = new Date(year, month, 1).getDay()
  return startFrom === 'Sun' ? day : day === 0 ? 6 : day - 1
}

export const getFirstDayOfWeekFromDispatch = (
  startFrom: 'Sun' | 'Mon',
  date: DispatchDate
): number => {
  if (!isCompleteDate(date)) return 0
  return getFirstDayOfWeek(startFrom, date.year, date.month)
}

export const shiftMonth = (
  year: number,
  month: number,
  delta: number
): { year: number; month: number } => {
  const newMonth = month + delta
  if (newMonth < 0) return { year: year - 1, month: 11 }
  if (newMonth > 11) return { year: year + 1, month: 0 }
  return { year, month: newMonth }
}
