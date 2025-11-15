import { useEffect, useState } from 'react'
import { getCurrentDate } from '@shared/utils/date'
import { useCalendarFacade } from '@date/calendar/application/facades'
import type {
  DispatchDate,
  SelectedDispatchDate,
  CalendarViewDate,
} from '@entities/date/domain/types'

export const useCalendarViewDate = () => {
  const { actions: actionsCalendar } = useCalendarFacade()
  const { setCalendarViewDate } = actionsCalendar

  const currentDate = getCurrentDate()
  const [viewDate, setViewDate] = useState<CalendarViewDate>({
    year: currentDate.currentYear,
    month: currentDate.currentMonth,
  })

  useEffect(() => {
    setCalendarViewDate({ year: viewDate.year, month: viewDate.month })
  }, [viewDate])

  return { viewDate, setViewDate }
}
