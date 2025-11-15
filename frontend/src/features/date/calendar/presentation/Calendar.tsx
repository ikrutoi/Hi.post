import React, { useState } from 'react'
import { CalendarWeekdayHeader } from './CalendarWeekdayHeader/CalendarWeekdayHeader'
import {
  daysOfWeekStartFromMon,
  daysOfWeekStartFromSun,
} from '@entities/date/constants'
import { useCalendarConstruction } from '@date/calendar/application/logic'
import styles from './Calendar.module.scss'
import type {
  DispatchDate,
  SelectedDispatchDate,
  CalendarViewDate,
  DaysOfWeek,
} from '@entities/date/domain/types'

interface CalendarProps {
  selectedDispatchDate: SelectedDispatchDate
  calendarViewDate: CalendarViewDate
  setSelectedDispatchDate: (date: DispatchDate) => void
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDispatchDate,
  calendarViewDate,
  setSelectedDispatchDate,
}) => {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<'Sun' | 'Mon'>('Sun')
  const [daysOfWeek, setDaysOfWeek] = useState<DaysOfWeek[]>(
    daysOfWeekStartFromSun
  )

  const handleFirstDay = (firstDay: 'Sun' | 'Mon') => {
    setFirstDayOfWeek(firstDay)
    setDaysOfWeek(
      firstDay === 'Sun' ? daysOfWeekStartFromSun : daysOfWeekStartFromMon
    )
  }

  const calendarCells = useCalendarConstruction({
    selectedDispatchDate,
    firstDayOfWeek,
    calendarViewDate,
    setSelectedDispatchDate,
    // handleClickCell,
  })

  return (
    <div className={styles.calendar}>
      <CalendarWeekdayHeader
        daysOfWeek={daysOfWeek}
        firstDayTitle={firstDayOfWeek}
        handleFirstDay={handleFirstDay}
      />
      <div className={styles['calendar__month']}>
        <div className={styles['calendar__days']}>{calendarCells}</div>
      </div>
    </div>
  )
}
