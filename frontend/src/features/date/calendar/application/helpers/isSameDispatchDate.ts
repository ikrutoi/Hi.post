import type { MonthDirection } from '@entities/date/domain/types'

export interface DateLike {
  year: number
  month: number
  day: number
}

export const isSameDate = (
  direction: MonthDirection,
  a: DateLike | null | undefined,
  b: DateLike | null | undefined
): boolean => {
  return (
    direction === 'current' &&
    !!a &&
    !!b &&
    a.year === b.year &&
    a.month === b.month &&
    a.day === b.day
  )
}
