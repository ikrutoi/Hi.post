import { DateNumericTitle, DispatchDate } from '@entities/date/domain'
import { CartCard } from '../../domain/calendarCellModel'

export interface CalendarComponentProps {
  selectedDateTitle: DateNumericTitle
  selectedDate: DispatchDate
  handleSelectedDate: (
    taboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (month: 'before' | 'after') => void
  dataShoppingCards: CartCard[] | null
}
