import { useEffect } from 'react'
import { useDateFacade } from '../../../application/facades'
import { useCalendarFacade } from '../../../calendar/application/facades'
import { useSwitcherFacade } from '../../../switcher/application/facades'
import { useCardEditorFacade } from '@entities/card/application/facades'
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
  const { state: stateDate, actions: actionsDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate
  const { setSelectedDispatchDate } = actionsDate

  const { state: stateCalendar } = useCalendarFacade()
  const { lastViewedCalendarDate } = stateCalendar

  const { state: stateSwitcher, actions: actionsSwitcher } = useSwitcherFacade()
  const { activeSwitcher } = stateSwitcher
  const { setActiveSwitcher } = actionsSwitcher

  const { actions: actionsSwitcherController } = useDateSwitcherController()
  const { decrementMonth, incrementMonth } = actionsSwitcherController

  const { actions: actionsCardEditor } = useCardEditorFacade()
  const { setSectionComplete } = actionsCardEditor

  useEffect(() => {
    if (selectedDispatchDate) {
    }
  }, [selectedDispatchDate])

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
      setSelectedDispatchDate(dispatchDate)
      setSectionComplete('date', dispatchDate)
    }

    if (direction === 'before') {
      if (activeSwitcher) setActiveSwitcher(null)
      decrementMonth()
      triggerFlash('month')
      if (lastViewedCalendarDate?.month === 0) {
        triggerFlash('year')
      }
    }

    if (direction === 'after') {
      if (activeSwitcher) setActiveSwitcher(null)
      incrementMonth()
      triggerFlash('month')
      if (lastViewedCalendarDate?.month === 11) {
        triggerFlash('year')
      }
    }

    // setSelectedDispatchDate({
    //   year: viewYear,
    //   month: viewMonth,
    //   day: dayCurrent,
    // })

    // if (cartItem) {
    //   logClick('calendar_cell_with_cart', { day: dayCurrent })
    // } else {
    //   logClick('calendar_cell_click', { day: dayCurrent })
    // }
  }

  return { handleCellClickLogic }
}
