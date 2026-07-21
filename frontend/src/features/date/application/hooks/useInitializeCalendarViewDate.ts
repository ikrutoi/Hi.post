import { useEffect, useRef } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { useDateFacade } from '../facades'
import { useCalendarFacade } from '../../calendar/application/facades'
import { getInitialCalendarDate } from '@shared/utils/date'

export const useInitializeCalendarViewDate = () => {
  const { selectedDate } = useDateFacade()
  const notebookStripTab = useAppSelector(selectNotebookStripTab)

  const { lastViewedCalendarDate, setCalendarViewDate } = useCalendarFacade()

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      /**
       * Корзина/история: не перебивать lastViewed датой сборки (`selectedDate`) —
       * иначе list→calendar снова уедет на чужой месяц, хотя lastViewed уже
       * выставлен на месяц открытки в CardPie.
       */
      const preferArchiveView =
        (notebookStripTab === 'cart' || notebookStripTab === 'history') &&
        lastViewedCalendarDate != null
      const initial = preferArchiveView
        ? {
            year: lastViewedCalendarDate.year,
            month: lastViewedCalendarDate.month,
          }
        : getInitialCalendarDate(selectedDate, lastViewedCalendarDate)
      setCalendarViewDate(initial)
      initialized.current = true
    }
  }, [])
}
