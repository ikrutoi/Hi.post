export interface CurrentDateTimeProps {
  selectedDateTitle: {
    year: number
    month: number
    day: number
  }
  isActiveDateTitle: string | false
  handleChangeTitle: (evt: React.MouseEvent<HTMLElement>) => void
}

export interface SliderProps {
  selectedDateTitle: {
    year: number
    month: number
    day: number
  }
  isActiveDateTitle: string | false
  handleChangeDateFromSlider: (
    sectionDate: 'year' | 'month',
    value: number
  ) => void
}

export interface CalendarProps {
  selectedDate: {
    year: number
    month: number
    day: number
  } | null
  selectedDateTitle: {
    year: number
    month: number
    day: number
  }
  handleSelectedDate: (
    isTaboo: boolean,
    selectedYear: number,
    selectedMonth: number,
    selectedDay: number
  ) => void
  handleClickCell: (month: 'before' | 'after') => void
  cart:
    | {
        id: string
        preview: string
        recipientName: string
        date: string
        price: number
      }[]
    | null
}

export interface DateState {
  year: number
  month: number
  day: number
}

export interface PostcardBase {
  date: string
  img: string
  id: string
  personalId: string
}

export type DateNumericTitle = {
  year: number
  month: number
  day: number
}

export type DateTextTitle = {
  year: string
  month: string
}

export type DateField = keyof DateTextTitle

export type FirstDay = 'Sun' | 'Mon'

export interface CalendarWeekTitleProps {
  daysOfWeek: string[]
  firstDayTitle: FirstDay
  handleFirstDay: (day: FirstDay) => void
}

export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fn' | 'Sat'

export type SunMonProps = {
  firstDayTitle: 'Sun' | 'Mon'
  handleFirstDay: (day: 'Sun' | 'Mon') => void
}

export const DATE_FIELDS: DateField[] = ['year', 'month']
