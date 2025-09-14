import type { CartPostcard } from '@features/cart/publicApi'

export const changeCartDay = (
  day: number,
  month: number,
  year: number,
  isCountCart?: CartPostcard[]
): CartPostcard[] => {
  const targetDate = { year, month, day }
  return (
    isCountCart?.filter((card) => {
      const [y, m, d] = card.date.split('-').map(Number)
      return (
        y === targetDate.year && m === targetDate.month && d === targetDate.day
      )
    }) ?? []
  )
}
