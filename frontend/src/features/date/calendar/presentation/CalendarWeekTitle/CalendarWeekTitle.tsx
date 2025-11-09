import React from 'react'
import { FirstDay } from '@entities/date/domain/types'
import { Cell } from '@date/cell/presentation/Cell'
import { SunMon } from './SunMon/SunMon'
import styles from './CalendarWeekTitle.module.scss'

interface CalendarWeekTitleProps {
  daysOfWeek: string[]
  firstDayTitle: FirstDay
  handleFirstDay: (day: FirstDay) => void
}

export const CalendarWeekTitle: React.FC<CalendarWeekTitleProps> = ({
  daysOfWeek,
  firstDayTitle,
  handleFirstDay,
}) => {
  return (
    <div className={styles['calendar-week-title']}>
      <div className={styles['calendar-week-title__sunmon']}>
        <SunMon
          key={firstDayTitle}
          firstDayTitle={firstDayTitle}
          handleFirstDay={handleFirstDay}
        />
      </div>
      <div className={styles['calendar-week-title__days']}>
        {daysOfWeek.slice(1).map((day, index) => (
          <Cell key={`${day}-${index + 1}`} title={day} />
        ))}
      </div>
    </div>
  )
}
