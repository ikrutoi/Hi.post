import React, { useState } from 'react'
import styles from './Calendar.module.scss'

import { CalendarWeekTitle } from './CalendarWeekTitle/CalendarWeekTitle'
import { useCalendarConstruction } from '@features/date/calendar/application/logic/calendarConstruction.logic'
import {
  daysOfWeekStartFromMon,
  daysOfWeekStartFromSun,
} from '@entities/date/constants'
import type { DispatchDate } from '@entities/date/domain/types'
import type { Cart } from '@cart/domain/types'

interface CalendarProps {
  dispatchDate: DispatchDate
  dispatchDateTitle: DispatchDate
  handleDispatchDate: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (direction: 'before' | 'after') => void
  cart?: Cart[]
}

export const Calendar: React.FC<CalendarProps> = ({
  dispatchDate,
  dispatchDateTitle,
  handleDispatchDate,
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
    dispatchDateTitle,
    dispatchDate,
    handleDispatchDate,
    handleClickCell,
    isCountCart: cart,
    firstDayOfWeekTitle,
  })

  return (
    <div className={styles.calendar}>
      <CalendarWeekTitle
        daysOfWeek={daysOfWeek}
        firstDayTitle={firstDayOfWeekTitle}
        handleFirstDay={handleFirstDay}
      />
      <div className={styles.month}>
        <div className={styles.days}>{calendarCells}</div>
      </div>
    </div>
  )
}
