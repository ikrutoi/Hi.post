import { getCurrentDate } from '@shared/utils/date'
import type { SelectedDispatchDate } from '../domain/types'

export const isSameMonthAndYear = (date: SelectedDispatchDate): boolean => {
  if (!date) return false
  const current = getCurrentDate()
  return (
    date.year === current.currentYear && date.month === current.currentMonth
  )
}
