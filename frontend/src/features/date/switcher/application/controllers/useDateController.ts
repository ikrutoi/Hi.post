import { useState } from 'react'
import { getCurrentDate } from '@shared/utils/date'
import { useDispatchDateState } from '../../infrastructure/state/useDispatchDateState'
import { useDispatchDateTitle } from '../../infrastructure/state/useDispatchDateTitle'
import type { DateRole, MonthDirection } from '@entities/date/domain/types'

export const useDateController = () => {
  const currentDate = getCurrentDate()
  const { dispatchDate, setDispatchDate } = useDispatchDateState()
  const { dispatchDateTitle, setDispatchDateTitle } = useDispatchDateTitle()
  const [activeDateTitleRole, setActiveDateTitleRole] = useState<
    DateRole | undefined
  >(undefined)

  const toggleActiveDateRole = (role: DateRole) => {
    setActiveDateTitleRole((prev) => (prev === role ? undefined : role))
  }

  const updateDateTitleField = (field: 'year' | 'month', value: number) => {
    if (!dispatchDateTitle.isSelected) return
    setDispatchDateTitle((prev) => ({ ...prev, [field]: value }))
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
    if (!dispatchDate.isSelected) return
    setDispatchDateTitle((prev) => ({
      ...prev,
      year: dispatchDate.year,
      month: dispatchDate.month,
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
    if (!activeDateTitleRole) setActiveDateTitleRole('month')
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
    if (!activeDateTitleRole) setActiveDateTitleRole('month')
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

  const handleSliderChange = (section: DateRole, value: number) => {
    updateDateTitleField(section, value)
  }

  return {
    state: {
      dispatchDate,
      dispatchDateTitle,
      activeDateTitleRole,
    },
    actions: {
      setDispatchDate,
      setDispatchDateTitle,
      setActiveDateTitleRole,
      toggleActiveDateRole,
      updateDateTitleField,
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
