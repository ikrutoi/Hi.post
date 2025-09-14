import type { DispatchDate } from '@entities/date/domain/types'

export function toDispatchDate(dateStr: string): DispatchDate {
  if (!dateStr) return { isSelected: false }

  const [year, month, day] = dateStr.split('-').map(Number)
  return {
    isSelected: true,
    year,
    month,
    day,
  }
}
