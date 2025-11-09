import type { DispatchDate } from '@entities/date/domain/types'
import { MONTH_NAMES } from '@entities/date/constants/months'

export const formatSelectedDispatchDate = (date: DispatchDate): string => {
  const { year, month, day } = date
  const monthName = MONTH_NAMES[month] ?? ''

  return `${year} ${monthName} ${day}`
}
