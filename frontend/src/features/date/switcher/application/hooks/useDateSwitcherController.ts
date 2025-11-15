import { useState } from 'react'
import { getCurrentDate } from '@shared/utils/date'
import { useDateFacade } from '../../../application/facades'
import { useSwitcherFacade } from '../facades'
import { useCalendarViewDate } from '.'
import type { DatePart, MonthDirection } from '@entities/date/domain/types'
import { SelectedDispatchDate } from '@entities/date/domain/types'

export const useDateSwitcherController = () => {
  const currentDate = getCurrentDate()

  const { state: stateDate, actions: actionsDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate
  const { setSelectedDispatchDate, resetSelectedDispatchDate } = actionsDate

  const { state: stateSwitcher, actions: actionsSwitcher } = useSwitcherFacade()
  const { activeSwitcher } = stateSwitcher
  const { setActiveSwitcher, toggleActiveSwitcher } = actionsSwitcher

  const { viewDate, setViewDate } = useCalendarViewDate()
  // conSwitcherveDatePart, setActiveDatePart] = useState<DatePart | undefined>(
  //   undefined
  // )

  // const toggleActiveDatePart = (part: DatePart) => {
  //   setActiveDatePart((prev) => (prev === part ? undefined : part))
  // }

  const updateDatePart = (part: DatePart, value: number) => {
    if (!selectedDispatchDate) return

    setViewDate((prev) => ({ ...prev, [part]: value }))
  }

  const goToTodayDate = () => {
    setViewDate({
      year: currentDate.currentYear,
      month: currentDate.currentMonth,
    })
  }

  const goToSelectedDate = () => {
    if (!selectedDispatchDate) return
    setViewDate((prev) => ({
      ...prev,
      year: selectedDispatchDate.year,
      month: selectedDispatchDate.month,
    }))
  }

  // const handleCalendarCellClick = (direction: MonthDirection) => {
  //   direction === 'before' ? decrementMonth() : incrementMonth()
  // }

  const decrementMonth = () => {
    // if (!selectedDispatchDate) return
    const { year, month } = viewDate
    setViewDate({
      year: month > 0 ? year : year - 1,
      month: month > 0 ? month - 1 : 11,
      // day,
    })
  }

  const incrementMonth = () => {
    // if (!selectedDispatchDate) return
    const { year, month } = viewDate
    setViewDate({
      year: month < 11 ? year : year + 1,
      month: month < 11 ? month + 1 : 0,
      // day,
    })
  }

  const handleDecrementArrow = () => {
    if (!activeSwitcher) setActiveSwitcher('month')
    // if (!selectedDispatchDate) return
    const { year, month } = viewDate
    if (activeSwitcher === 'year') {
      setViewDate({ year: year - 1, month })
    }
    if (activeSwitcher === 'month') {
      decrementMonth()
    }
  }

  // const handleDispatchDate = (
  //   isTaboo: boolean,
  //   year: number,
  //   month: number,
  //   day: number
  // ) => {
  //   if (!isTaboo) {
  //     const newDate = { year, month, day }
  //     setSelectedDispatchDate(newDate)
  //   }
  // }

  const handleIncrementArrow = () => {
    if (!activeSwitcher) setActiveSwitcher('month')
    // if (!selectedDispatchDate) return
    const { year, month } = viewDate
    if (activeSwitcher === 'year') {
      setViewDate({ year: year + 1, month })
    }
    if (activeSwitcher === 'month') {
      incrementMonth()
    }
  }

  const isCurrentMonth = (): boolean => {
    if (!selectedDispatchDate) return false
    return (
      viewDate.year === currentDate.currentYear &&
      viewDate.month === currentDate.currentMonth
    )
  }

  const handleSliderChange = (section: DatePart, value: number) => {
    updateDatePart(section, value)
  }

  return {
    state: {
      selectedDispatchDate,
      viewDate,
      activeSwitcher,
    },
    actions: {
      setSelectedDispatchDate,
      setViewDate,
      setActiveSwitcher,
      toggleActiveSwitcher,
      updateDatePart,
      goToTodayDate,
      goToSelectedDate,
      // handleCalendarCellClick,
      handleDecrementArrow,
      handleIncrementArrow,
      handleSliderChange,
      // handleDispatchDate,
    },
    derived: {
      isCurrentMonth,
    },
  }
}
