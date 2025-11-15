import type {
  CalendarViewDate,
  MonthDirection,
} from '@entities/date/domain/types'

export interface HandleCellClickParams {
  dayCurrent?: number
  dayBefore?: number
  dayAfter?: number
  isDisabledDate?: boolean
  calendarViewDate: CalendarViewDate
  direction: MonthDirection
  // cartItem?: CartItem
}
