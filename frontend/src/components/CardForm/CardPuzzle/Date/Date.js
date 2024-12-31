import { useState } from 'react'
import './Date.scss'
import Calendar from './Calendar/Calendar'
import CurrentDateTime from './CurrentDateTime/CurrentDateTime'

const Date = () => {
  const [selectedDate, setSelectedDate] = useState({
    year: '',
    month: '',
    day: '',
  })

  return (
    <div className="date">
      <form className="date-form">
        <div className="date-header">
          <div className="header-sign"></div>
          <div className="header-date">
            <span></span>
            <CurrentDateTime />
          </div>
          <div className="header-sign"></div>
        </div>
        <div className="date-slider">
          <span className="slider-line"></span>
        </div>
        <div className="date-calendar">
          <Calendar />
        </div>
      </form>
    </div>
  )
}

export default Date
