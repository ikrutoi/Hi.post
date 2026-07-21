import type { AppDispatch } from '@app/state/store'
import type { RootState } from '@app/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { calendarViewDateForPostcard } from '@date/application/helpers/stripDefaultSelection'
import {
  openDayPanel,
  updateLastViewedCalendarDate,
} from '@date/calendar/infrastructure/state'
import { calendarDayHasCards } from '@date/cell/domain/calendarDayContent'
import { selectCardsByDateMap } from '@entities/card/infrastructure/selectors'
import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import { dispatchDateKeyFromPostcard } from '../../infrastructure/calendarDayPostcardCycle'

function isFilledDispatchDate(d: DispatchDate): boolean {
  return !(
    d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  )
}

/** После выбора открытки в центре archive CardPie — месяц календаря и панель дня. */
export function syncArchiveCenterPostcardCalendarView(
  dispatch: AppDispatch,
  getState: () => RootState,
  localId: number,
  options?: { includeDayPanel?: boolean },
): void {
  const includeDayPanel = options?.includeDayPanel !== false
  const postcard =
    selectCartItems(getState()).find((item) => item.localId === localId) ??
    null
  if (postcard == null || !isFilledDispatchDate(postcard.date)) return

  dispatch(updateLastViewedCalendarDate(calendarViewDateForPostcard(postcard)))

  if (!includeDayPanel) return

  const dateKey = dispatchDateKeyFromPostcard(postcard)
  const dayData = selectCardsByDateMap(getState())[dateKey]
  if (dayData != null && calendarDayHasCards(dayData)) {
    dispatch(openDayPanel({ dateKey, dayData }))
  }
}
