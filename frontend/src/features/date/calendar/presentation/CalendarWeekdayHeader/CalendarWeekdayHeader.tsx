import React from 'react'
import { FirstDay, DaysOfWeek } from '@entities/date/domain/types'
import { WeekdayHeaderCell } from './WeekdayHeaderCell/WeekdayHeaderCell'
import { SunMon } from './SunMon/SunMon'
import styles from './CalendarWeekdayHeader.module.scss'

interface CalendarWeekdayHeaderProps {
  daysOfWeek: DaysOfWeek[]
  firstDayTitle: FirstDay
  handleFirstDay: (day: FirstDay) => void
}

export const CalendarWeekdayHeader: React.FC<CalendarWeekdayHeaderProps> = ({
  daysOfWeek,
  firstDayTitle,
  handleFirstDay,
}) => {
  return (
    <div className={styles.calendarWeekdayHeader}>
      <div className={styles.sunmon}>
        <SunMon
          key={firstDayTitle}
          firstDayTitle={firstDayTitle}
          handleFirstDay={handleFirstDay}
        />
      </div>
      <div className={styles.days}>
        {daysOfWeek.slice(1).map((day, index) => (
          <WeekdayHeaderCell key={`${day}-${index + 1}`} weekday={day} />
        ))}
      </div>
    </div>
  )
}
