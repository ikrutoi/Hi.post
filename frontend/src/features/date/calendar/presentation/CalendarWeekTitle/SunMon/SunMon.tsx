import React from 'react'
import './SunMon.scss'
import { FirstDay } from '@entities/date/domain'

interface SunMonProps {
  firstDayTitle: FirstDay
  handleFirstDay: (day: FirstDay) => void
}

export const SunMon: React.FC<SunMonProps> = ({
  firstDayTitle,
  handleFirstDay,
}) => {
  const handleFirstDayOfWeek = () => {
    handleFirstDay(firstDayTitle === 'Sun' ? 'Mon' : 'Sun')
  }

  return (
    <div
      className="calendar-week-title__sunmon-toggle"
      onClick={handleFirstDayOfWeek}
    >
      <span className="calendar-week-title__sunmon-label">{firstDayTitle}</span>
    </div>
  )
}
