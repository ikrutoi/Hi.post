import { DateNumericTitle, SelectedDate } from '@features/date/types'

export interface ShoppingCard {
  id: string
  personalId: string
  img: string
  date: {
    year: number
    month: number
    day: number
  }
}

export interface CalendarProps {
  selectedDateTitle: DateNumericTitle
  selectedDate: SelectedDate | null
  handleSelectedDate: (
    taboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (month: 'before' | 'after') => void
  dataShoppingCards: ShoppingCard[] | null
}
