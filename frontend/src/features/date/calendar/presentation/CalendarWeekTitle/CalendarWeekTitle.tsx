import React from 'react'
import { Cell } from './Cell/Cell'
import { SunMon } from './SunMon/SunMon'
import './CalendarWeekTitle.scss'
import { FirstDay } from '@entities/date/domain'

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
    <div className="calendar-week-title">
      <div className="calendar-week-title__sunmon">
        <SunMon
          key={firstDayTitle}
          firstDayTitle={firstDayTitle}
          handleFirstDay={handleFirstDay}
        />
      </div>
      <div className="calendar-week-title__days">
        {daysOfWeek.slice(1).map((day, index) => (
          <Cell key={`${day}-${index + 1}`} title={day} />
        ))}
      </div>
    </div>
  )
}
