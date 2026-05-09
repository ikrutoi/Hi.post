import { isDisabledDate } from '@entities/date/utils'
import type { CalendarViewDate } from '@entities/date/domain/types'
import {
  getDaysInCurrentMonth,
  getDaysInPreviousMonth,
  getFirstDayOfWeekFromDispatch,
} from '../../utils'
import { shiftMonth } from '../helpers'

type FirstDayOfWeek = 'Sun' | 'Mon'

/**
 * Все enabled `dateKey` календарной сетки (42 ячейки) в порядке рендера:
 * dayBefore → current → dayAfter — как в `useCalendarConstruction`.
 */
export function collectCartDatePickWaveEnabledKeysInGridOrder(params: {
  calendarViewDate: CalendarViewDate
  firstDayOfWeek: FirstDayOfWeek
  currentDate: { day: number; month: number; year: number }
}): string[] {
  const { calendarViewDate, firstDayOfWeek, currentDate } = params
  const { year, month } = calendarViewDate
  const daysInPrevMonth = getDaysInPreviousMonth(year, month)
  const daysInCurrMonth = getDaysInCurrentMonth(year, month)
  const offset = getFirstDayOfWeekFromDispatch(
    firstDayOfWeek,
    calendarViewDate,
  )

  const prevDays = Array.from(
    { length: offset },
    (_, i) => daysInPrevMonth - i,
  ).reverse()
  const currDays = Array.from({ length: daysInCurrMonth }, (_, i) => i + 1)
  const nextDays = Array.from(
    { length: 42 - offset - daysInCurrMonth },
    (_, i) => i + 1,
  )

  const segments: Array<{
    direction: 'before' | 'current' | 'after'
    days: number[]
  }> = [
    { direction: 'before', days: prevDays },
    { direction: 'current', days: currDays },
    { direction: 'after', days: nextDays },
  ]

  const keys: string[] = []
  for (const { direction, days } of segments) {
    const { year: y, month: mo } = shiftMonth(calendarViewDate, direction)
    const cellMonth = { year: y, month: mo }
    for (const day of days) {
      if (!isDisabledDate(day, cellMonth, currentDate)) {
        keys.push(`${y}-${mo}-${day}`)
      }
    }
  }
  return keys
}
