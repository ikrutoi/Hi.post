import { useEffect, useRef } from 'react'
import { useDateFacade } from '../facades'
import { useCalendarFacade } from '../../calendar/application/facades'
import { getInitialCalendarDate } from '@shared/utils/date'

export const useInitializeCalendarViewDate = () => {
  const { selectedDate } = useDateFacade()

  const { state: stateCalendar, actions: actionsCalendar } = useCalendarFacade()
  const { lastViewedCalendarDate } = stateCalendar
  const { setCalendarViewDate } = actionsCalendar

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      const initial = getInitialCalendarDate(
        selectedDate,
        lastViewedCalendarDate
      )
      setCalendarViewDate(initial)
      initialized.current = true
    }
  }, [])
}
