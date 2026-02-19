import { useEffect } from 'react'
import { useDateFacade } from '../../../application/facades'
import { useCalendarFacade } from '../../../calendar/application/facades'
import { useSwitcherFacade } from '../../../switcher/application/facades'
import { useDateSwitcherController } from '../../../switcher/application/hooks'
import type { CartItem } from '@entities/cart/domain/types'
import type {
  CalendarViewDate,
  MonthDirection,
  Switcher,
} from '@entities/date/domain/types'

interface HandleCellClickParams {
  isDisabledDate?: boolean
  dayBefore?: number
  dayCurrent?: number
  dayAfter?: number
  calendarViewDate?: CalendarViewDate
  direction: MonthDirection
  // cartItem?: CartItem
}

interface UseCalendarCellControllerParams {
  triggerFlash: (part: Switcher) => void
}

export const useCalendarCellController = ({
  triggerFlash,
}: UseCalendarCellControllerParams) => {
  const { selectedDate, chooseDate } = useDateFacade()

  const { state: stateCalendar } = useCalendarFacade()
  const { lastViewedCalendarDate } = stateCalendar

  const { state: stateSwitcher, actions: actionsSwitcher } = useSwitcherFacade()
  const { position } = stateSwitcher
  const { changePosition } = actionsSwitcher

  const { actions: actionsSwitcherController } = useDateSwitcherController()
  const { decrementMonth, incrementMonth } = actionsSwitcherController

  useEffect(() => {
    if (selectedDate) {
    }
  }, [selectedDate])

  const handleCellClickLogic = ({
    isDisabledDate,
    dayBefore,
    dayCurrent,
    dayAfter,
    calendarViewDate,
    direction,
  }: HandleCellClickParams) => {
    const dayValue = dayCurrent ?? dayBefore ?? dayAfter

    if (
      direction === 'current' &&
      !isDisabledDate &&
      dayCurrent != null &&
      calendarViewDate?.year != null &&
      calendarViewDate?.month != null
    ) {
      const dispatchDate = {
        year: calendarViewDate.year,
        month: calendarViewDate.month,
        day: dayCurrent,
      }
      chooseDate(dispatchDate)
    }

    if (direction === 'before') {
      // if (position) changePosition(null)
      decrementMonth()
      triggerFlash('month')
      if (lastViewedCalendarDate?.month === 0) {
        triggerFlash('year')
      }
    }

    if (direction === 'after') {
      // if (position) changePosition(null)
      incrementMonth()
      triggerFlash('month')
      if (lastViewedCalendarDate?.month === 11) {
        triggerFlash('year')
      }
    }
  }

  return { handleCellClickLogic }
}
