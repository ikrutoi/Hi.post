// src/features/calendar/facade/calendarViewFacade.ts
import { useCalendarController } from '../controllers'

export const useCalendarFacade = () => {
  const {
    state: { lastViewedCalendarDate },
    actions: { setCalendarViewDate, resetCalendarView },
  } = useCalendarController()

  // const isViewDateSet: lastViewedCalendarDate !== null,
  // viewDateOrDefault: lastViewedCalendarDate ?? {
  //   year: new Date().getFullYear(),
  //   month: new Date().getMonth() + 1,
  // }

  return {
    state: {
      lastViewedCalendarDate,
    },
    actions: {
      setCalendarViewDate,
      resetCalendarView,
    },
  }
}
