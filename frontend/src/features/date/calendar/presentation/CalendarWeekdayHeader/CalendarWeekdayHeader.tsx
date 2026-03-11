import React from 'react'
import { FirstDay, DaysOfWeek } from '@entities/date/domain/types'
import { WeekdayHeaderCell } from './WeekdayHeaderCell/WeekdayHeaderCell'
import styles from './CalendarWeekdayHeader.module.scss'
import type { Switcher } from '@entities/date/domain/types'

interface CalendarWeekdayHeaderProps {
  daysOfWeek: DaysOfWeek[]
  firstDayTitle: FirstDay
  handleFirstDay: (day: FirstDay) => void
  /** Клик по дню недели (Sat, Sun и т.д.) — открыть/закрыть панель карточек дня. */
  onWeekdayClick?: (weekday: DaysOfWeek) => void
  flashPart?: Switcher
}

export const CalendarWeekdayHeader: React.FC<CalendarWeekdayHeaderProps> = ({
  daysOfWeek,
  firstDayTitle,
  handleFirstDay,
  onWeekdayClick,
}) => {
  return (
    <div className={styles.calendarWeekdayHeader}>
      {daysOfWeek.map((day, index) => (
        <WeekdayHeaderCell
          key={`${day}-${index}`}
          weekday={day}
          isFirstDay={index === 0}
          firstDayTitle={firstDayTitle}
          handleFirstDay={handleFirstDay}
          onWeekdayClick={onWeekdayClick}
        />
      ))}
    </div>
  )
}
