import { useState } from 'react'
import { getCurrentDate } from '@shared/utils/date'
import { useDateFacade } from '../facades'
import { useDispatchDateTitle } from '../../switcher/infrastructure/state/useDispatchDateTitle'
import type { DatePart, MonthDirection } from '@entities/date/domain/types'
import { SelectedDispatchDate } from '@entities/date/domain/types'

export const useDateSwitcherController = () => {
  const currentDate = getCurrentDate()

  const { state: stateDate, actions: actionsDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate
  const { setSelectedDispatchDate, resetSelectedDispatchDate } = actionsDate

  // const { dispatchDate, setDispatchDate } = useDispatchDateState()
  const { dispatchDateTitle, setDispatchDateTitle } = useDispatchDateTitle()
  const [activeDateTitleRole, setActiveDateTitlePart] = useState<
    DatePart | undefined
  >(undefined)

  const toggleActiveDatePart = (part: DatePart) => {
    setActiveDateTitlePart((prev) => (prev === part ? undefined : part))
  }

  const updateDateTitlePart = (part: DatePart, value: number) => {
    if (!selectedDispatchDate) return

    setDispatchDateTitle((prev) => ({ ...prev, [part]: value }))
  }

  const goToTodayDate = () => {
    setDispatchDateTitle({
      isSelected: true,
      year: currentDate.currentYear,
      month: currentDate.currentMonth,
      day: currentDate.currentDay,
    })
  }

  const goToSelectedDate = () => {
    if (!selectedDispatchDate) return
    setDispatchDateTitle((prev) => ({
      ...prev,
      year: selectedDispatchDate.year,
      month: selectedDispatchDate.month,
    }))
  }

  const handleCalendarCellClick = (direction: MonthDirection) => {
    direction === 'before' ? decrementMonthTitle() : incrementMonthTitle()
  }

  const decrementMonthTitle = () => {
    if (!dispatchDateTitle.isSelected) return
    const { year, month, day } = dispatchDateTitle
    setDispatchDateTitle({
      isSelected: true,
      year: month > 0 ? year : year - 1,
      month: month > 0 ? month - 1 : 11,
      day,
    })
  }

  const incrementMonthTitle = () => {
    if (!dispatchDateTitle.isSelected) return
    const { year, month, day } = dispatchDateTitle
    setDispatchDateTitle({
      isSelected: true,
      year: month < 11 ? year : year + 1,
      month: month < 11 ? month + 1 : 0,
      day,
    })
  }

  const handleDecrementArrow = () => {
    if (!activeDateTitleRole) setActiveDateTitlePart('month')
    if (!dispatchDateTitle.isSelected) return
    const { year, month, day } = dispatchDateTitle
    if (activeDateTitleRole === 'year') {
      setDispatchDateTitle({ isSelected: true, year: year - 1, month, day })
    }
    if (activeDateTitleRole === 'month') {
      decrementMonthTitle()
    }
  }

  const handleDispatchDate = (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => {
    if (!isTaboo) {
      const newDate = { isSelected: true, year, month, day }
      setDispatchDate(newDate)
    }
  }

  const handleIncrementArrow = () => {
    if (!activeDateTitleRole) setActiveDateTitlePart('month')
    if (!dispatchDateTitle.isSelected) return
    const { year, month, day } = dispatchDateTitle
    if (activeDateTitleRole === 'year') {
      setDispatchDateTitle({ isSelected: true, year: year + 1, month, day })
    }
    if (activeDateTitleRole === 'month') {
      incrementMonthTitle()
    }
  }

  const isCurrentMonth = (): boolean => {
    return (
      dispatchDateTitle.isSelected &&
      dispatchDateTitle.year === currentDate.currentYear &&
      dispatchDateTitle.month === currentDate.currentMonth
    )
  }

  const handleSliderChange = (section: DatePart, value: number) => {
    updateDateTitlePart(section, value)
  }

  return {
    state: {
      selectedDispatchDate,
      dispatchDateTitle,
      activeDateTitleRole,
    },
    actions: {
      setDispatchDate,
      setDispatchDateTitle,
      setActiveDateTitlePart,
      toggleActiveDatePart,
      updateDateTitlePart,
      goToTodayDate,
      goToSelectedDate,
      handleCalendarCellClick,
      handleDecrementArrow,
      handleIncrementArrow,
      handleSliderChange,
      handleDispatchDate,
    },
    derived: {
      isCurrentMonth,
    },
  }
}
