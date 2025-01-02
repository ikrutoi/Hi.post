import { useState } from 'react'
import './Date.scss'
import Calendar from './Calendar/Calendar'
import CurrentDateTime from './CurrentDateTime/CurrentDateTime'
import { currentDate } from '../../../../utils/date/date'

const Date = () => {
  const [selectedDate, setSelectedDate] = useState({
    year: currentDate.currentYear,
    month: currentDate.currentMonth,
    day: currentDate.currentDay,
  })

  return (
    <div className="date">
      <form className="date-form">
        <div className="date-header">
          <div className="header-sign">Left</div>
          <div className="header-date">
            <CurrentDateTime selectedDate={selectedDate} />
          </div>
          <div className="header-sign">Right</div>
        </div>
        <div className="date-slider">
          <span className="slider-line"></span>
        </div>
        <div className="date-calendar">
          <Calendar selectedDate={selectedDate} />
        </div>
      </form>
    </div>
  )
}

export default Date
