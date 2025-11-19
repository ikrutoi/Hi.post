import { useEffect, useRef } from 'react'
import { useDateFacade } from '../facades'
import { useCalendarFacade } from '../../calendar/application/facades'
import { getInitialCalendarDate } from '@shared/utils/date'

export const useInitializeCalendarViewDate = () => {
  const { state: stateDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate

  const { state: stateCalendar, actions: actionsCalendar } = useCalendarFacade()
  const { lastViewedCalendarDate } = stateCalendar
  const { setCalendarViewDate } = actionsCalendar

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      const initial = getInitialCalendarDate(
        selectedDispatchDate,
        lastViewedCalendarDate
      )
      setCalendarViewDate(initial)
      initialized.current = true
    }
  }, [])
}
