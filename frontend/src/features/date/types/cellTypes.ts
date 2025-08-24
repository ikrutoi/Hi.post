import type { Cart } from '@features/cart/publicApi'
import { CartPostcard } from '@features/cart/publicApi'

export interface DateTitle {
  year: number
  month: number
}

export interface CellProps {
  title?: string
  dayBefore?: number
  dayCurrent?: number
  dayAfter?: number
  today?: boolean
  isTaboo?: boolean
  selected?: boolean
  selectedDateTitle: DateTitle
  cartDay?: Cart
  handleSelectedDate?: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (position: 'before' | 'after') => void
}
