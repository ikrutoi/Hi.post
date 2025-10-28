import type { CartItem } from '@cart/domain/types'
import { isCompleteDate } from '@entities/date/utils/guard'

export const changeCartDay = (
  day: number,
  month: number,
  year: number,
  cartItems: CartItem[] | null
): CartItem[] => {
  return (
    cartItems?.filter((item) => {
      const date = item.date
      return (
        isCompleteDate(date) &&
        date.year === year &&
        date.month === month &&
        date.day === day
      )
    }) ?? []
  )
}
