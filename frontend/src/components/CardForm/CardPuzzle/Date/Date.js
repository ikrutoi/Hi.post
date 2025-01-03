import { useState } from 'react'
import './Date.scss'
import Calendar from './Calendar/Calendar'
import CurrentDateTime from './CurrentDateTime/CurrentDateTime'
import { currentDate } from '../../../../utils/date/date'
import Slider from './Slider/Slider'

const Date = () => {
  const [selectedDate, setSelectedDate] = useState({
    year: currentDate.currentYear,
    month: currentDate.currentMonth,
    day: currentDate.currentDay,
  })

  const [changeYear, setChangeYear] = useState(false)
  const handlerChangeYear = () => {
    if (changeMonth) {
      setChangeMonth(false)
      setChangeYear(true)
    }
    if (!changeMonth) {
      setChangeYear(true)
    }
  }

  const [changeMonth, setChangeMonth] = useState(false)
  const handlerChangeMonth = () => {
    if (changeYear) {
      setChangeYear(false)
      setChangeMonth(true)
    }
    if (!changeYear) {
      setChangeYear(true)
    }
  }

  const scrollMonthMinus = () => {
    if (selectedDate.month > 0) {
      setSelectedDate((state) => {
        return { ...state, month: selectedDate.month - 1 }
      })
    }
    if (selectedDate.month === 0) {
      setSelectedDate((state) => {
        return { ...state, month: 11, year: selectedDate.year - 1 }
      })
    }
  }
  const scrollMonthPlus = () => {
    if (selectedDate.month < 11) {
      setSelectedDate((state) => {
        return { ...state, month: selectedDate.month + 1 }
      })
    }
    if (selectedDate.month === 11) {
      setSelectedDate((state) => {
        return { ...state, month: 0, year: selectedDate.year + 1 }
      })
    }
  }

  return (
    <div className="date">
      <form className="date-form">
        <div className="date-header">
          <div className="header-sign" onClick={scrollMonthMinus}>
            Left
          </div>
          <div className="header-date">
            <CurrentDateTime
              selectedDate={selectedDate}
              handlerChangeYear={handlerChangeYear}
              handlerChangeMonth={handlerChangeMonth}
            />
          </div>
          <div className="header-sign" onClick={scrollMonthPlus}>
            Right
          </div>
        </div>
        <div className="date-slider">
          <Slider changeYear={changeYear} changeMonth={changeMonth} />
        </div>
        <div className="date-calendar">
          <Calendar selectedDate={selectedDate} />
        </div>
      </form>
    </div>
  )
}

export default Date
