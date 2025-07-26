import React from 'react'
import Cell from '../Calendar/Cell/Cell'
import SunMon from '../Calendar/SunMon/SunMon'
import './CalendarWeekTitle.scss'

const CalendarWeekTitle = ({ daysOfWeek, firstDayTitle, handleFirstDay }) => {
  const fillingTitlesWeek = () => {
    let weekTitle = []
    weekTitle.push(
      <SunMon
        key={firstDayTitle}
        firstDayTitle={firstDayTitle}
        handleFirstDay={handleFirstDay}
      />
    )
    for (let day = 1; day < daysOfWeek.length; day++) {
      weekTitle.push(
        <Cell key={`${daysOfWeek[day]}-${day}`} title={daysOfWeek[day]} />
      )
    }
    return weekTitle
  }
  return <div className={'calendar-title'}>{fillingTitlesWeek()}</div>
}

export default CalendarWeekTitle
