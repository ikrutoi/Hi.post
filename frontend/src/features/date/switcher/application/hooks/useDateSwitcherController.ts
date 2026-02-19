import { getCurrentDate } from '@shared/utils/date'
import { useDateFacade } from '../../../application/facades'
import { useCalendarFacade } from '../../../calendar/application/facades'
import { useSwitcherFacade } from '../../../switcher/application/facades'
import { getFlashPartsForDateChange } from '../helpers'
import type { Switcher } from '@entities/date/domain/types'

interface UseDateSwitcherControllerParams {
  triggerFlash?: (part: Switcher) => void
}

export const useDateSwitcherController = ({
  triggerFlash,
}: UseDateSwitcherControllerParams = {}) => {
  const currentDate = getCurrentDate()

  const { selectedDate, chooseDate } = useDateFacade()

  const { state: stateSwitcher } = useSwitcherFacade()
  const { position } = stateSwitcher

  const { state: stateCalendar, actions: actionsCalendar } = useCalendarFacade()
  const { lastViewedCalendarDate } = stateCalendar
  const { setCalendarViewDate } = actionsCalendar

  const goToTodayDate = () => {
    if (!lastViewedCalendarDate) return

    const todayDate = {
      year: currentDate.year,
      month: currentDate.month,
    }

    setCalendarViewDate(todayDate)

    if (triggerFlash) {
      const partsToFlash = getFlashPartsForDateChange(
        lastViewedCalendarDate,
        todayDate
      )
      partsToFlash.forEach(triggerFlash)
    }
  }

  const goToSelectedDate = () => {
    if (!selectedDate || !lastViewedCalendarDate) return

    const targetDate = {
      year: selectedDate.year,
      month: selectedDate.month,
    }

    setCalendarViewDate(targetDate)

    if (triggerFlash) {
      const partsToFlash = getFlashPartsForDateChange(
        lastViewedCalendarDate,
        targetDate
      )
      partsToFlash.forEach(triggerFlash)
    }
  }

  const decrementMonth = () => {
    if (!lastViewedCalendarDate) return
    const { year, month } = lastViewedCalendarDate
    setCalendarViewDate({
      year: month > 0 ? year : year - 1,
      month: month > 0 ? month - 1 : 11,
    })
  }

  const incrementMonth = () => {
    if (!lastViewedCalendarDate) return
    const { year, month } = lastViewedCalendarDate
    setCalendarViewDate({
      year: month < 11 ? year : year + 1,
      month: month < 11 ? month + 1 : 0,
    })
  }

  const handleDecrementArrow = () => {
    if (!lastViewedCalendarDate) return
    const { year, month } = lastViewedCalendarDate
    if (position === 'year') {
      setCalendarViewDate({ year: year - 1, month })
    }
    if (position === 'month') {
      decrementMonth()
    }
  }

  const handleIncrementArrow = () => {
    if (!lastViewedCalendarDate) return
    const { year, month } = lastViewedCalendarDate
    if (position === 'year') {
      setCalendarViewDate({ year: year + 1, month })
    }
    if (position === 'month') {
      incrementMonth()
    }
  }

  const isCurrentMonth = (): boolean => {
    if (!lastViewedCalendarDate) return false
    return (
      lastViewedCalendarDate.year === currentDate.year &&
      lastViewedCalendarDate.month === currentDate.month
    )
  }

  return {
    state: {
      selectedDate,
      lastViewedCalendarDate,
      position,
    },
    actions: {
      chooseDate,
      setCalendarViewDate,
      goToTodayDate,
      goToSelectedDate,
      handleDecrementArrow,
      handleIncrementArrow,
      decrementMonth,
      incrementMonth,
    },
    derived: {
      isCurrentMonth,
    },
  }
}
