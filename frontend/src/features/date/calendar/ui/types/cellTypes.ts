import { DispatchDate } from '@entities/date/domain'

type LegacyCart = Array<{
  day: number
  preview: string
  recipientName: string
  date: string
  price: number
}>

export interface CellComponentProps {
  title?: string
  dayBefore?: number
  dayCurrent?: number
  dayAfter?: number
  today?: boolean
  isTaboo?: boolean
  selected?: boolean
  selectedDateTitle: DispatchDate
  cartDay?: LegacyCart
  handleSelectedDate?: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (position: 'before' | 'after') => void
}
