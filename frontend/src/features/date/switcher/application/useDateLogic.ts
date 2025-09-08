import { useState } from 'react'
import type {
  DispatchDate,
  DateRole,
  MonthDirection,
} from '@entities/date/domain'
import { currentDate } from '@features/date/calendar/domain'

export const useDateLogic = () => {
  const [visibleDispatchDate, setVisibleDispatchDate] = useState<DispatchDate>({
    isSelected: true,
    year: currentDate.currentYear,
    month: currentDate.currentMonth,
    day: currentDate.currentDay,
  })

  const [selectedDispatchDate, setSelectedDispatchDate] =
    useState<DispatchDate>({
      isSelected: false,
    })

  const [activeDateRole, setActiveDateRole] = useState<DateRole | undefined>(
    undefined
  )

  const changeMonthTitleMinus = () => {
    if (!visibleDispatchDate.isSelected) return
    const { year, month, day } = visibleDispatchDate
    setVisibleDispatchDate({
      isSelected: true,
      year: month > 0 ? year : year - 1,
      month: month > 0 ? month - 1 : 11,
      day,
    })
  }

  const changeMonthTitlePlus = () => {
    if (!visibleDispatchDate.isSelected) return
    const { year, month, day } = visibleDispatchDate
    setVisibleDispatchDate({
      isSelected: true,
      year: month < 11 ? year : year + 1,
      month: month < 11 ? month + 1 : 0,
      day,
    })
  }

  const handleArrowMinus = () => {
    if (!activeDateRole) setActiveDateRole('month')
    if (!visibleDispatchDate.isSelected) return
    const { year, month, day } = visibleDispatchDate
    if (activeDateRole === 'year') {
      setVisibleDispatchDate({ isSelected: true, year: year - 1, month, day })
    }
    if (activeDateRole === 'month') {
      changeMonthTitleMinus()
    }
  }

  const handleArrowPlus = () => {
    if (!activeDateRole) setActiveDateRole('month')
    if (!visibleDispatchDate.isSelected) return
    const { year, month, day } = visibleDispatchDate
    if (activeDateRole === 'year') {
      setVisibleDispatchDate({ isSelected: true, year: year + 1, month, day })
    }
    if (activeDateRole === 'month') {
      changeMonthTitlePlus()
    }
  }

  const handleClickCell = (direction: MonthDirection) => {
    direction === 'before' ? changeMonthTitleMinus() : changeMonthTitlePlus()
  }

  const handleTransitionTodayDate = () => {
    setVisibleDispatchDate({
      isSelected: true,
      year: currentDate.currentYear,
      month: currentDate.currentMonth,
      day: currentDate.currentDay,
    })
  }

  const handleTransitionSelectedDate = () => {
    if (!selectedDispatchDate.isSelected) return
    const { year, month, day } = selectedDispatchDate
    setVisibleDispatchDate({ isSelected: true, year, month, day })
  }

  const toggleActiveDateRole = (role: DateRole) => {
    setActiveDateRole((prev) => (prev === role ? undefined : role))
  }

  const handleChangeVisibleDateFromSlider = (
    section: 'year' | 'month',
    value: number
  ) => {
    if (!visibleDispatchDate.isSelected) return
    setVisibleDispatchDate((prev) => ({ ...prev, [section]: value }))
  }

  return {
    visibleDispatchDate,
    selectedDispatchDate,
    activeDateRole,
    setVisibleDispatchDate,
    setSelectedDispatchDate,
    setActiveDateRole,
    changeMonthTitleMinus,
    changeMonthTitlePlus,
    handleArrowMinus,
    handleArrowPlus,
    handleClickCell,
    toggleActiveDateRole,
    handleTransitionTodayDate,
    handleTransitionSelectedDate,
    handleChangeVisibleDateFromSlider,
  }
}
