import { DispatchDate } from '@entities/date/domain'

export interface CurrentDateTimeProps {
  selectedDateTitle: DispatchDate
  isActiveDateTitle: string | false
  handleChangeTitle: (evt: React.MouseEvent<HTMLElement>) => void
}

export interface SliderProps {
  selectedDateTitle: DispatchDate
  isActiveDateTitle: string | false
  handleChangeDateFromSlider: (
    sectionDate: 'year' | 'month',
    value: number
  ) => void
}

export type SunMonProps = {
  firstDayTitle: 'Sun' | 'Mon'
  handleFirstDay: (day: 'Sun' | 'Mon') => void
}

export interface CalendarWeekTitleProps {
  daysOfWeek: string[]
  firstDayTitle: 'Sun' | 'Mon'
  handleFirstDay: (day: 'Sun' | 'Mon') => void
}
