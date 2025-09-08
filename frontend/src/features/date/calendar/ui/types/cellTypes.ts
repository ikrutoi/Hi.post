import { DispatchDate } from '@entities/date/domain'
import { Cart } from '../../../toolbar/domain/toolbarModel'

export interface CellComponentProps {
  title?: string
  dayBefore?: number
  dayCurrent?: number
  dayAfter?: number
  today?: boolean
  isTaboo?: boolean
  selected?: boolean
  selectedDateTitle: DispatchDate
  cartDay?: Cart
  handleSelectedDate?: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (position: 'before' | 'after') => void
}
