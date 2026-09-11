import type {
  CalendarViewDate,
  SelectedDispatchDate,
} from '@entities/date/domain/types'
import {
  earliestAllowedDispatchCalendarView,
  type OrderCalendarCurrentDate,
} from '@entities/date/utils'

/**
 * Месяц календаря сборки (factory / notebook «Дата»):
 * выбранная дата или первый месяц с доступными днями (сегодня + lead).
 */
export function resolveAssemblyCalendarViewDate(params: {
  currentDate: OrderCalendarCurrentDate
  selectedDate: SelectedDispatchDate
}): CalendarViewDate {
  if (params.selectedDate) {
    return {
      year: params.selectedDate.year,
      month: params.selectedDate.month,
    }
  }
  return earliestAllowedDispatchCalendarView(params.currentDate)
}
