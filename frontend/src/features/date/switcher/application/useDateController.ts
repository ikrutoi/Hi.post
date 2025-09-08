import { useState } from 'react'
import type {
  DispatchDate,
  DateRole,
  MonthDirection,
} from '@entities/date/domain'
import { currentDate } from '@features/date/calendar/domain'

export const useDateController = (initialDate: DispatchDate) => {
  const [selectedDate, setSelectedDate] = useState<DispatchDate>({
    isSelected: false,
  })
  const [selectedDateTitle, setSelectedDateTitle] =
    useState<DispatchDate>(initialDate)
  const [activeDateTitleRole, setActiveDateTitleRole] = useState<
    DateRole | undefined
  >(undefined)

  const toggleActiveDateRole = (role: DateRole) => {
    setActiveDateTitleRole((prev) => (prev === role ? undefined : role))
  }

  const updateDateTitleField = (field: 'year' | 'month', value: number) => {
    if (!selectedDateTitle.isSelected) return
    setSelectedDateTitle((prev) => ({ ...prev, [field]: value }))
  }

  const goToTodayDate = () => {
    setSelectedDateTitle({
      isSelected: true,
      year: currentDate.currentYear,
      month: currentDate.currentMonth,
      day: currentDate.currentDay,
    })
  }

  const goToSelectedDate = () => {
    if (!selectedDate.isSelected) return
    setSelectedDateTitle((prev) => ({
      ...prev,
      year: selectedDate.year,
      month: selectedDate.month,
    }))
  }

  const handleCalendarCellClick = (direction: MonthDirection) => {
    direction === 'before' ? decrementMonthTitle() : incrementMonthTitle()
  }

  const decrementMonthTitle = () => {
    if (!selectedDateTitle.isSelected) return
    const { year, month, day } = selectedDateTitle
    setSelectedDateTitle({
      isSelected: true,
      year: month > 0 ? year : year - 1,
      month: month > 0 ? month - 1 : 11,
      day,
    })
  }

  const incrementMonthTitle = () => {
    if (!selectedDateTitle.isSelected) return
    const { year, month, day } = selectedDateTitle
    setSelectedDateTitle({
      isSelected: true,
      year: month < 11 ? year : year + 1,
      month: month < 11 ? month + 1 : 0,
      day,
    })
  }

  const handleDecrementArrow = () => {
    if (!activeDateTitleRole) setActiveDateTitleRole('month')
    if (!selectedDateTitle.isSelected) return
    const { year, month, day } = selectedDateTitle
    if (activeDateTitleRole === 'year') {
      setSelectedDateTitle({ isSelected: true, year: year - 1, month, day })
    }
    if (activeDateTitleRole === 'month') {
      decrementMonthTitle()
    }
  }

  const handleIncrementArrow = () => {
    if (!activeDateTitleRole) setActiveDateTitleRole('month')
    if (!selectedDateTitle.isSelected) return
    const { year, month, day } = selectedDateTitle
    if (activeDateTitleRole === 'year') {
      setSelectedDateTitle({ isSelected: true, year: year + 1, month, day })
    }
    if (activeDateTitleRole === 'month') {
      incrementMonthTitle()
    }
  }

  const isCurrentMonth = (): boolean => {
    return (
      selectedDateTitle.isSelected &&
      selectedDateTitle.year === currentDate.currentYear &&
      selectedDateTitle.month === currentDate.currentMonth
    )
  }

  const handleSliderChange = (section: DateRole, value: number) => {
    updateDateTitleField(section, value)
  }

  return {
    state: {
      selectedDate,
      selectedDateTitle,
      activeDateTitleRole,
    },
    actions: {
      setSelectedDate,
      setSelectedDateTitle,
      setActiveDateTitleRole,
      toggleActiveDateRole,
      updateDateTitleField,
      goToTodayDate,
      goToSelectedDate,
      handleCalendarCellClick,
      handleDecrementArrow,
      handleIncrementArrow,
      handleSliderChange,
    },
    derived: {
      isCurrentMonth,
    },
  }
}
