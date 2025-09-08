import type { DispatchDate } from '../domain/dispatchDate'
import { MONTH_NAMES } from '../constants/months'

export const formatDispatchDate = (date: DispatchDate): string => {
  if (!date.isSelected) return ''
  const { year, month, day } = date
  if (month < 0 || month > 11) return ''
  const monthName = MONTH_NAMES[month] ?? ''
  return `${year} ${monthName} ${day}`
}
