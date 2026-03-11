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
  /** Данные дня из cardsMap (превью по статусам) — для обработчика клика при необходимости. */
  dayData?: CardCalendarIndex | null
}
