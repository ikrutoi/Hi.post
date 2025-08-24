import { SelectedDate } from '@features/date/types'

export const numberDaysInPreviousMonth = (
  year: number,
  month: number
): number => new Date(year, month, 0).getDate()

export const numberDaysInCurrentMonth = (
  year: number,
  month: number
): number => {
  if (month !== 11) {
    month++
  } else {
    month = 0
    year++
  }
  return new Date(year, month, 0).getDate()
}

export const firstDayOfWeek = (
  firstDay: 'Sun' | 'Mon',
  selectedDate: SelectedDate
): number => {
  const day = new Date(selectedDate.year, selectedDate.month, 1).getDay()
  return firstDay === 'Sun' ? day : day === 0 ? 6 : day - 1
}
