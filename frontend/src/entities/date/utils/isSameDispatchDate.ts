import type { DispatchDate } from '@entities/date/domain/types'

export const isSameDispatchDate = (
  a: DispatchDate,
  b: DispatchDate
): boolean => {
  if (!a.isSelected || !b.isSelected) return false
  return a.year === b.year && a.month === b.month && a.day === b.day
}
