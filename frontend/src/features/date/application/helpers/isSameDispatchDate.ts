import type { DispatchDate } from '@entities/date/domain/types'

export const isSameDispatchDate = (
  dispatch: DispatchDate,
  date: { year: number; month: number; day: number }
): boolean => {
  if (!dispatch.isSelected) return false
  return (
    dispatch.year === date.year &&
    dispatch.month === date.month &&
    dispatch.day === date.day
  )
}
