import { useEffect, useRef } from 'react'
import { useAppSelector } from '@app/hooks'
import {
  selectCartCalendarDatePickMode,
  selectCartDatePickSessionActive,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCartListSelectedLocalId } from '@cart/infrastructure/selectors/cartSelectors'
import { useDateFacade } from '../facades'
import { useCalendarFacade } from '../../calendar/application/facades'
import { getInitialCalendarDate, getCurrentDate } from '@shared/utils/date'
import { earliestAllowedDispatchCalendarView } from '@entities/date/utils'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { RootState } from '@app/state'

export const useInitializeCalendarViewDate = () => {
  const { selectedDate } = useDateFacade()
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const cartDatePickSessionActive = useAppSelector(
    selectCartDatePickSessionActive,
  )
  const archiveFactoryEditActive = useAppSelector(
    (s: RootState) => s.cardPanel?.archiveFactoryEditActive === true,
  )
  const cartItems = useAppSelector(selectCartItems)
  const cartListSelectedLocalId = useAppSelector(selectCartListSelectedLocalId)

  const { lastViewedCalendarDate, setCalendarViewDate } = useCalendarFacade()

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      const now = getCurrentDate()
      const archivePostcardStatus =
        cartListSelectedLocalId != null
          ? cartItems.find((p) => p.localId === cartListSelectedLocalId)?.status
          : undefined
      /**
       * unblocked / cart date-pick: календарь с нуля (сегодня + lead).
       * Не брать selectedDate сборки — там может быть незаапрувленный октябрь и т.п.
       */
      const freshBlockedCalendar =
        notebookStripTab === 'unblocked' ||
        cartCalendarDatePickMode ||
        cartDatePickSessionActive ||
        (archiveFactoryEditActive && archivePostcardStatus === 'cartBlocked')

      /**
       * Корзина/история (просмотр): не перебивать lastViewed датой сборки.
       */
      const preferArchiveView =
        (notebookStripTab === 'cart' || notebookStripTab === 'history') &&
        lastViewedCalendarDate != null &&
        !freshBlockedCalendar

      let initial: CalendarViewDate
      if (freshBlockedCalendar) {
        initial = earliestAllowedDispatchCalendarView(now)
      } else if (preferArchiveView) {
        initial = {
          year: lastViewedCalendarDate.year,
          month: lastViewedCalendarDate.month,
        }
      } else {
        /** Сборка: месяц выбранной (в т.ч. ещё не Apply) даты. */
        initial = getInitialCalendarDate(selectedDate, lastViewedCalendarDate)
      }
      setCalendarViewDate(initial)
      initialized.current = true
    }
  }, [])
}
