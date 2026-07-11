import type { CalendarViewDate } from '@entities/date/domain/types'
import type { OrderCalendarCurrentDate } from '@entities/date/utils'
import { isCalendarGridThirdCellFromEndDisabled } from './calendarGridThirdFromEndDisabled'

type FirstDayOfWeek = 'Sun' | 'Mon'

/**
 * Месяц календаря для выбора новой даты отправки (cartBlocked → dateEdit).
 * Если в текущем видимом месяце «третья с конца» ячейка disabled — переходим на текущий месяц/год.
 */
export function resolveCartDatePickCalendarViewDate(params: {
  calendarViewDate: CalendarViewDate | null | undefined
  firstDayOfWeek: FirstDayOfWeek
  currentDate: OrderCalendarCurrentDate
}): CalendarViewDate {
  const { firstDayOfWeek, currentDate } = params
  const view: CalendarViewDate = params.calendarViewDate ?? {
    year: currentDate.year,
    month: currentDate.month,
  }

  if (
    isCalendarGridThirdCellFromEndDisabled({
      calendarViewDate: view,
      firstDayOfWeek,
      currentDate,
    })
  ) {
    return { year: currentDate.year, month: currentDate.month }
  }

  return view
}
