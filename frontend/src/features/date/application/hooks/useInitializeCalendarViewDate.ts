import { useEffect, useRef } from 'react'
import { useAppSelector } from '@app/hooks'
import {
  selectCartCalendarDatePickMode,
  selectCartDatePickSessionActive,
  selectCartdateBranch,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCartListSelectedLocalId } from '@cart/infrastructure/selectors/cartSelectors'
import {
  isDateCalendarStrip,
  resolveCartdateBranch,
} from '@date/calendar/application/logic/calendarStripSection'
import { resolveAssemblyCalendarViewDate } from '@date/calendar/application/logic/assemblyCalendarView'
import { useDateFacade } from '../facades'
import { useCalendarFacade } from '../../calendar/application/facades'
import { getInitialCalendarDate, getCurrentDate } from '@shared/utils/date'
import { earliestAllowedDispatchCalendarView } from '@entities/date/utils'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { RootState } from '@app/state'

export const useInitializeCalendarViewDate = () => {
  const { selectedDate } = useDateFacade()
  const activeSection = useAppSelector(selectActiveSection)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const cartdateBranch = useAppSelector(selectCartdateBranch)
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
  const calendarContextKeyRef = useRef<string | null>(null)
  const prevSelectedDateRef = useRef(selectedDate)

  useEffect(() => {
    if (!initialized.current) {
      const now = getCurrentDate()
      const archivePostcard =
        cartListSelectedLocalId != null
          ? cartItems.find((p) => p.localId === cartListSelectedLocalId)
          : undefined
      const branchFromPostcard =
        archivePostcard != null
          ? resolveCartdateBranch({
              status: archivePostcard.status,
              dates: [archivePostcard.date],
              currentDate: now,
            })
          : null
      /**
       * `cartdate` ветка `cartBlocked`: календарь с нуля (сегодня + lead).
       * Ветка `cart`: месяц открытки (lastViewed / App уже выставил).
       */
      const freshBlockedCalendar =
        cartdateBranch === 'cartBlocked' ||
        ((notebookStripTab === 'cartdate' ||
          cartCalendarDatePickMode ||
          cartDatePickSessionActive ||
          archiveFactoryEditActive) &&
          branchFromPostcard === 'cartBlocked')

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
      } else if (isDateCalendarStrip(activeSection, notebookStripTab)) {
        /** Сборка: не lastViewed из корзины/истории — первая доступная дата. */
        initial = resolveAssemblyCalendarViewDate({
          currentDate: now,
          selectedDate,
        })
      } else {
        /** cartdate cart: месяц выбранной даты или lastViewed. */
        initial = getInitialCalendarDate(selectedDate, lastViewedCalendarDate)
      }
      setCalendarViewDate(initial)
      initialized.current = true
    }
  }, [])

  useEffect(() => {
    const contextKey = `${activeSection ?? ''}:${notebookStripTab}`
    const assemblyDateStrip = isDateCalendarStrip(
      activeSection,
      notebookStripTab,
    )

    if (!assemblyDateStrip) {
      calendarContextKeyRef.current = contextKey
      prevSelectedDateRef.current = selectedDate
      return
    }

    const enteredAssembly = calendarContextKeyRef.current !== contextKey
    const clearedSelection =
      prevSelectedDateRef.current != null && selectedDate == null

    if (enteredAssembly || clearedSelection) {
      setCalendarViewDate(
        resolveAssemblyCalendarViewDate({
          currentDate: getCurrentDate(),
          selectedDate,
        }),
      )
    }

    calendarContextKeyRef.current = contextKey
    prevSelectedDateRef.current = selectedDate
  }, [
    activeSection,
    notebookStripTab,
    selectedDate,
    setCalendarViewDate,
  ])
}
