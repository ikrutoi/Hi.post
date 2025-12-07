import { useDispatch, useSelector } from 'react-redux'
import { updateLastViewedCalendarDate } from '../../infrastructure/state'
import { selectLastCalendarViewDate } from '../../infrastructure/selectors'
import type { CalendarViewDate } from '@entities/date/domain/types'

export const useCalendarController = () => {
  const dispatch = useDispatch()
  const lastViewedCalendarDate = useSelector(selectLastCalendarViewDate)

  const setCalendarViewDate = (date: CalendarViewDate) => {
    dispatch(updateLastViewedCalendarDate(date))
  }

  return {
    state: {
      lastViewedCalendarDate,
    },
    actions: {
      setCalendarViewDate,
    },
  }
}
