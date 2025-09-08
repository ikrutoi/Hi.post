import React, { useState } from 'react'
import './Calendar.scss'

import { CalendarWeekTitle } from './CalendarWeekTitle/CalendarWeekTitle'
import { useCalendarConstruction } from '@features/date/calendar/application/useCalendarConstruction'
import {
  daysOfWeekStartFromMon,
  daysOfWeekStartFromSun,
} from '@entities/date/constants'

import type { DispatchDate } from '@entities/date/domain/dispatchDate'
import type { CartPostcard } from '@features/cart/publicApi'

interface CalendarProps {
  selectedDate: DispatchDate
  selectedDateTitle: DispatchDate
  handleSelectedDate: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (direction: 'before' | 'after') => void
  cart?: CartPostcard[]
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  selectedDateTitle,
  handleSelectedDate,
  handleClickCell,
  cart,
}) => {
  const [firstDayOfWeekTitle, setFirstDayOfWeek] = useState<'Sun' | 'Mon'>(
    'Sun'
  )
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(daysOfWeekStartFromSun)

  const handleFirstDay = (firstDay: 'Sun' | 'Mon') => {
    setFirstDayOfWeek(firstDay)
    setDaysOfWeek(
      firstDay === 'Sun' ? daysOfWeekStartFromSun : daysOfWeekStartFromMon
    )
  }

  const calendarCells = useCalendarConstruction({
    selectedDateTitle,
    selectedDate,
    handleSelectedDate,
    handleClickCell,
    isCountCart: cart,
    firstDayOfWeekTitle,
  })

  return (
    <div className="calendar">
      <CalendarWeekTitle
        daysOfWeek={daysOfWeek}
        firstDayTitle={firstDayOfWeekTitle}
        handleFirstDay={handleFirstDay}
      />
      <div className="calendar__month">
        <div className="calendar__days">{calendarCells}</div>
      </div>
    </div>
  )
}
