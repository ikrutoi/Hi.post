import { useAppDispatch, useAppSelector } from '@app/hooks'
import { updateLastViewedCalendarDate } from '../../infrastructure/state'
import { selectLastCalendarViewDate } from '../../infrastructure/selectors'
import type { CalendarViewDate } from '@entities/date/domain/types'

export const useCalendarFacade = () => {
  const dispatch = useAppDispatch()
  const lastViewedCalendarDate = useAppSelector(selectLastCalendarViewDate)

  const setCalendarViewDate = (date: CalendarViewDate) => {
    dispatch(updateLastViewedCalendarDate(date))
  }

  return {
    lastViewedCalendarDate,
    setCalendarViewDate,
  }
}
