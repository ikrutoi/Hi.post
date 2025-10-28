import type { DispatchDate, DateRole } from '@entities/date/domain/types'
import { MONTH_NAMES } from '@entities/date/constants/months'

export const formatDispatchDate = (
  date: DispatchDate,
  role?: DateRole
): string => {
  if (!date.isSelected) return ''

  const { year, month, day } = date

  if (month < 0 || month > 11) return ''

  const monthName = MONTH_NAMES[month] ?? ''

  if (role === 'month') return monthName
  if (role === 'year') return String(year)

  return `${year} ${monthName} ${day}`
}
