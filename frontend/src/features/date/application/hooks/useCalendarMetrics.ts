import { getCurrentDate } from '@shared/utils/date'
import type { SelectedDate } from '../../domain/types'

type FirstDay = 'Sun' | 'Mon'

export const useCalendarMetrics = () => {
  const currentDate = getCurrentDate()

  const yearForCurrentDaysInMonth =
    currentDate.currentMonth !== 11
      ? currentDate.currentYear
      : currentDate.currentYear + 1

  const monthForCurrentDaysInMonth =
    currentDate.currentMonth !== 11 ? currentDate.currentMonth + 1 : 0

  const daysInCurrentMonth = new Date(
    yearForCurrentDaysInMonth,
    monthForCurrentDaysInMonth,
    0
  ).getDate()

  const numberDaysInPreviousMonth = (year: number, month: number): number =>
    new Date(year, month, 0).getDate()

  const numberDaysInCurrentMonth = (year: number, month: number): number => {
    const nextMonth = month !== 11 ? month + 1 : 0
    const nextYear = month !== 11 ? year : year + 1
    return new Date(nextYear, nextMonth, 0).getDate()
  }

  const firstDayOfWeek = (
    firstDay: FirstDay,
    selectedDate: SelectedDate
  ): number => {
    const day = new Date(selectedDate.year, selectedDate.month, 1).getDay()
    return firstDay === 'Sun' ? day : day === 0 ? 6 : day - 1
  }

  return {
    daysInCurrentMonth,
    numberDaysInPreviousMonth,
    numberDaysInCurrentMonth,
    firstDayOfWeek,
  }
}
