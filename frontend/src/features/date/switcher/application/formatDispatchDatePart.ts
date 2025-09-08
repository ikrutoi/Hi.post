import type {
  DispatchDate,
  DateRole,
} from '../../../../entities/date/domain/dispatchDate'
import { MONTH_NAMES } from '../../../../entities/date/constants/months'

export const formatDispatchDatePart = (
  date: DispatchDate,
  role: DateRole
): string => {
  if (!date.isSelected) return ''
  if (role === 'month') return MONTH_NAMES[date.month] ?? ''
  if (role === 'year') return String(date.year)
  return ''
}
