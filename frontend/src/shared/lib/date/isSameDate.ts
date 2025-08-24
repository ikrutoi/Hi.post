import { ParsedDate } from '@shared/types/date'

export function isSameDate(a: ParsedDate, b: ParsedDate): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day
}
