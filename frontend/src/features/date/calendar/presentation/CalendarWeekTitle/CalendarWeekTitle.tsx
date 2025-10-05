import React from 'react'
import styles from './CalendarWeekTitle.module.scss'

import { Cell } from './Cell/Cell'
import { SunMon } from './SunMon/SunMon'

import { FirstDay } from '@entities/date/domain/types'

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
    <div className={styles.wrapper}>
      <div className={styles.sunmon}>
        <SunMon
          key={firstDayTitle}
          firstDayTitle={firstDayTitle}
          handleFirstDay={handleFirstDay}
        />
      </div>
      <div className={styles.days}>
        {daysOfWeek.slice(1).map((day, index) => (
          <Cell key={`${day}-${index + 1}`} title={day} />
        ))}
      </div>
    </div>
  )
}
