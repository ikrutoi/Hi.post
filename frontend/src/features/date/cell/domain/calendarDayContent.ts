import type { CardCalendarIndex } from '@entities/card/domain/types'

export function calendarDayHasCards(dayData: CardCalendarIndex): boolean {
  return (
    !!dayData.processed ||
    dayData.cart.length > 0 ||
    dayData.ready.length > 0 ||
    dayData.sent.length > 0 ||
    dayData.delivered.length > 0 ||
    dayData.error.length > 0
  )
}

export function isEmptyCalendarDay(
  dayData: CardCalendarIndex | undefined | null,
): boolean {
  if (dayData == null) return true
  return !calendarDayHasCards(dayData)
}
