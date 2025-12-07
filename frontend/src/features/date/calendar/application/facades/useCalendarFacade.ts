import { useCalendarController } from '../controllers'

export const useCalendarFacade = () => {
  const {
    state: { lastViewedCalendarDate },
    actions: { setCalendarViewDate },
  } = useCalendarController()

  return {
    state: {
      lastViewedCalendarDate,
    },
    actions: {
      setCalendarViewDate,
    },
  }
}
