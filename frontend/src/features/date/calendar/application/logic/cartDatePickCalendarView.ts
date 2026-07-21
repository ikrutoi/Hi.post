import type { CalendarViewDate } from '@entities/date/domain/types'
import {
  earliestAllowedDispatchCalendarView,
  type OrderCalendarCurrentDate,
} from '@entities/date/utils'

/**
 * Месяц календаря для выбора новой даты отправки (cartBlocked → dateEdit):
 * всегда первый месяц, в котором есть доступная дата (сегодня + lead),
 * независимо от lastViewed / пролистанного месяца.
 */
export function resolveCartDatePickCalendarViewDate(params: {
  currentDate: OrderCalendarCurrentDate
}): CalendarViewDate {
  return earliestAllowedDispatchCalendarView(params.currentDate)
}
