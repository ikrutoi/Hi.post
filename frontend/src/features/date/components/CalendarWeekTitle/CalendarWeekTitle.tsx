import React from 'react'
import Cell from '../Calendar/Cell/Cell'
import { SunMon } from '@features/date/publicApi.ts'
import './CalendarWeekTitle.scss'
import type { CalendarWeekTitleProps } from '@features/date/types'

export const CalendarWeekTitle: React.FC<CalendarWeekTitleProps> = ({
  daysOfWeek,
  firstDayTitle,
  handleFirstDay,
}) => {
  const fillingTitlesWeek = () => {
    const weekTitle = [
      <SunMon
        key={firstDayTitle}
        firstDayTitle={firstDayTitle}
        handleFirstDay={handleFirstDay}
      />,
    ]

    for (let day = 1; day < daysOfWeek.length; day++) {
      weekTitle.push(
        <Cell key={`${daysOfWeek[day]}-${day}`} title={daysOfWeek[day]} />
      )
    }

    return weekTitle
  }

  return <div className="calendar-title">{fillingTitlesWeek()}</div>
}
