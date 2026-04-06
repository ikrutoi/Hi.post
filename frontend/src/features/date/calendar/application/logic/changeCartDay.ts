import type { Postcard } from '@entities/postcard'

export const changeCartDay = (
  day: number,
  month: number,
  year: number,
  postcards: Postcard[] | null,
): Postcard[] => {
  return (
    postcards?.filter((item) => {
      const date = item.card.date
      return (
        date != null &&
        date.year === year &&
        date.month === month &&
        date.day === day
      )
    }) ?? []
  )
}
