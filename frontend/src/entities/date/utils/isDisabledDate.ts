import { DISPATCH_MIN_LEAD_DAYS } from '@shared/config/constants'
import type { CalendarViewDate, DispatchDate } from '../domain/types'

export type OrderCalendarCurrentDate = {
  year: number
  month: number
  day: number
}

function localMidnightMs(
  year: number,
  month: number,
  day: number,
): number {
  return new Date(year, month, day).setHours(0, 0, 0, 0)
}

function earliestAllowedDispatchMidnight(
  currentDate: OrderCalendarCurrentDate,
): number {
  const earliest = new Date(
    currentDate.year,
    currentDate.month,
    currentDate.day,
  )
  earliest.setDate(earliest.getDate() + DISPATCH_MIN_LEAD_DAYS)
  return earliest.setHours(0, 0, 0, 0)
}

/** Месяц/год первой даты, доступной для заказа (сегодня + lead). */
export function earliestAllowedDispatchCalendarView(
  currentDate: OrderCalendarCurrentDate,
): CalendarViewDate {
  const earliest = new Date(
    currentDate.year,
    currentDate.month,
    currentDate.day,
  )
  earliest.setDate(earliest.getDate() + DISPATCH_MIN_LEAD_DAYS)
  return {
    year: earliest.getFullYear(),
    month: earliest.getMonth(),
  }
}

export function isDispatchDateDisabledForOrder(
  d: DispatchDate,
  currentDate: OrderCalendarCurrentDate,
): boolean {
  return isDisabledDate(d.day, { year: d.year, month: d.month }, currentDate)
}

export const isDisabledDate = (
  day: number,
  calendarViewDate: CalendarViewDate,
  currentDate: OrderCalendarCurrentDate,
): boolean => {
  if (!calendarViewDate) return false

  const { year, month } = calendarViewDate
  const cellMidnight = localMidnightMs(year, month, day)
  const earliestMidnight = earliestAllowedDispatchMidnight(currentDate)

  return cellMidnight < earliestMidnight
}
