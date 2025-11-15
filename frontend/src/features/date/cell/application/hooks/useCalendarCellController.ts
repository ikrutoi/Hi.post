import { useEffect } from 'react'
import { useDateFacade } from '../../../application/facades'

import { useDateSwitcherController } from '../../../switcher/application/hooks'
import type { CartItem } from '@entities/cart/domain/types'
import type {
  CalendarViewDate,
  MonthDirection,
} from '@entities/date/domain/types'

interface HandleCellClickParams {
  isDisabledDate?: boolean
  dayBefore?: number
  dayCurrent?: number
  dayAfter?: number
  calendarViewDate?: CalendarViewDate
  direction: MonthDirection
  // viewYear: number
  // viewMonth: number
  // cartItem?: CartItem
}

export const useCalendarCellController = () => {
  const { state: stateDate, actions: actionsDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate
  const { setSelectedDispatchDate } = actionsDate

  const { actions: actionsSwitcher } = useDateSwitcherController()
  const { handleDecrementArrow, handleIncrementArrow } = actionsSwitcher
  // const { logClick } = useAnalytics()

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
    // viewYear,
    // viewMonth,
    // cartItem,
  }: HandleCellClickParams) => {
    // if (isDisabledDate || dayCurrent == null) return

    const dayValue = dayCurrent ?? dayBefore ?? dayAfter

    if (
      direction === 'current' &&
      !isDisabledDate &&
      dayCurrent != null &&
      calendarViewDate?.year != null &&
      calendarViewDate?.month != null
    ) {
      setSelectedDispatchDate({
        year: calendarViewDate.year,
        month: calendarViewDate.month,
        day: dayCurrent,
      })
    }

    if (direction === 'after') {
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
