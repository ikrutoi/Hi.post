import type {
  CalendarViewDate,
  MonthDirection,
} from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'

export interface HandleCellClickParams {
  dayCurrent?: number
  dayBefore?: number
  dayAfter?: number
  isDisabledDate?: boolean
  calendarViewDate: CalendarViewDate
  direction: MonthDirection
  dateKey?: string
  dayData?: CardCalendarIndex | null
}
