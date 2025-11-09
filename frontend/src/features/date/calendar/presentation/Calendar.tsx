import React, { useState } from 'react'
import { CalendarWeekTitle } from './CalendarWeekTitle/CalendarWeekTitle'
import {
  daysOfWeekStartFromMon,
  daysOfWeekStartFromSun,
} from '@entities/date/constants'
import { useCalendarConstruction } from '@date/calendar/application/logic'
import styles from './Calendar.module.scss'
import type { DispatchDate } from '@entities/date/domain/types'

interface CalendarProps {
  dispatchDate: DispatchDate
  handleDispatchDate: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (direction: 'before' | 'after') => void
}

export const Calendar: React.FC<CalendarProps> = ({
  dispatchDate,
  handleDispatchDate,
  handleClickCell,
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
    dispatchDate,
    handleDispatchDate,
    handleClickCell,
    firstDayOfWeekTitle,
  })

  return (
    <div className={styles.calendar}>
      <CalendarWeekTitle
        daysOfWeek={daysOfWeek}
        firstDayTitle={firstDayOfWeekTitle}
        handleFirstDay={handleFirstDay}
      />
      <div className={styles['calendar__month']}>
        <div className={styles['calendar__days']}>{calendarCells}</div>
      </div>
    </div>
  )
}
