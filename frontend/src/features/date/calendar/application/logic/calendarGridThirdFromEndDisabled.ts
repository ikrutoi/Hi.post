import { isDisabledDate } from '@entities/date/utils'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { OrderCalendarCurrentDate } from '@entities/date/utils'
import {
  getDaysInCurrentMonth,
  getDaysInPreviousMonth,
  getFirstDayOfWeekFromDispatch,
} from '../../utils'
import { shiftMonth } from '../helpers'

type FirstDayOfWeek = 'Sun' | 'Mon'

const GRID_CELL_COUNT = 42
/** Третья ячейка с конца сетки 6×7 (порядок как в `useCalendarConstruction`). */
const THIRD_FROM_END_INDEX = GRID_CELL_COUNT - 3

function buildCalendarGridCellsInRenderOrder(params: {
  calendarViewDate: CalendarViewDate
  firstDayOfWeek: FirstDayOfWeek
}): Array<{ year: number; month: number; day: number }> {
  const { calendarViewDate, firstDayOfWeek } = params
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

  const cells: Array<{ year: number; month: number; day: number }> = []
  for (const { direction, days } of segments) {
    const { year: y, month: mo } = shiftMonth(calendarViewDate, direction)
    for (const day of days) {
      cells.push({ year: y, month: mo, day })
    }
  }
  return cells
}

/**
 * Для текущего видимого месяца: третья с конца ячейка сетки календаря (42 клетки)
 * в том же порядке, что и рендер — `before` → `current` → `after`.
 */
export function isCalendarGridThirdCellFromEndDisabled(params: {
  calendarViewDate: CalendarViewDate
  firstDayOfWeek: FirstDayOfWeek
  currentDate: OrderCalendarCurrentDate
}): boolean {
  const cells = buildCalendarGridCellsInRenderOrder(params)
  const cell = cells[THIRD_FROM_END_INDEX]
  if (!cell) return false
  return isDisabledDate(
    cell.day,
    { year: cell.year, month: cell.month },
    params.currentDate,
  )
}
