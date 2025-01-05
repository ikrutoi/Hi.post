import { useState } from 'react'
import './Date.scss'
import Calendar from './Calendar/Calendar'
import CurrentDateTime from './CurrentDateTime/CurrentDateTime'
import { currentDate } from '../../../../utils/date/date'
import Slider from './Slider/Slider'

const Date = () => {
  const [selectedDateTitle, setSelectedDateTitle] = useState({
    year: currentDate.currentYear,
    month: currentDate.currentMonth,
    day: currentDate.currentDay,
  })
  const [selectedDate, setSelectedDate] = useState(false)

  const [isActiveChangeYear, setIsActiveChangeYear] = useState(false)
  const [isActiveChangeMonth, setIsActiveChangeMonth] = useState(false)
  const [isActiveDateTitle, setIsActiveDateTitle] = useState(false)

  // useEffect(() => {
  //   let intervalSliderYear
  //   if (changeYear) {
  //     intervalSliderYear = setInterval(() => {
  //       setChangeYear(false)
  //     }, 8000)
  //   }
  //   return () => clearInterval(intervalSliderYear)
  // }, [changeYear])

  // useEffect(() => {
  //   let intervalSliderMonth
  //   if (changeMonth) {
  //     intervalSliderMonth = setInterval(() => {
  //       setChangeMonth(false)
  //     }, 8000)
  //   }
  //   return () => clearInterval(intervalSliderMonth)
  // }, [changeMonth])
  const handleSelectedDate = (selectedYear, selectedMonth, selectedDay) => {
    setSelectedDate({
      year: selectedYear,
      month: selectedMonth,
      day: selectedDay,
    })
    setSelectedDateTitle((state) => {
      return {
        ...state,
        day: selectedDay,
      }
    })
  }

  const handleChangeYear = () => {
    if (isActiveChangeMonth) {
      setIsActiveChangeMonth(false)
    }
    setIsActiveChangeYear(true)
    setIsActiveDateTitle('year')
  }

  const handleChangeMonth = () => {
    if (isActiveChangeYear) {
      setIsActiveChangeYear(false)
    }
    setIsActiveChangeMonth(true)
    setIsActiveDateTitle('month')
  }

  const scrollMonthMinus = () => {
    if (selectedDateTitle.month > 0) {
      setSelectedDateTitle((state) => {
        return { ...state, month: selectedDateTitle.month - 1 }
      })
    }
    if (selectedDateTitle.month === 0) {
      setSelectedDateTitle((state) => {
        return { ...state, month: 11, year: selectedDateTitle.year - 1 }
      })
    }
  }

  const scrollMonthPlus = () => {
    if (selectedDateTitle.month < 11) {
      setSelectedDateTitle((state) => {
        return { ...state, month: selectedDateTitle.month + 1 }
      })
    }
    if (selectedDateTitle.month === 11) {
      setSelectedDateTitle((state) => {
        return { ...state, month: 0, year: selectedDateTitle.year + 1 }
      })
    }
  }

  // const handleChangeMonthWithSlider = () => {}

  return (
    <div className="date">
      <form className="date-form">
        <div className="date-header">
          <div className="header-sign" onClick={scrollMonthMinus}>
            Left
          </div>
          <div className="header-date">
            <CurrentDateTime
              selectedDateTitle={selectedDateTitle}
              isActiveDateTitle={isActiveDateTitle}
              handleChangeYear={handleChangeYear}
              handleChangeMonth={handleChangeMonth}
            />
          </div>
          <div className="header-sign" onClick={scrollMonthPlus}>
            Right
          </div>
        </div>
        <div className="date-slider">
          <Slider
            selectedDateTitle={selectedDateTitle}
            isActiveChangeYear={isActiveChangeYear}
            isActiveChangeMonth={isActiveChangeMonth}
            setSelectedDateTitle={setSelectedDateTitle}
          />
        </div>
        <div className="date-calendar">
          <Calendar
            selectedDate={selectedDate}
            selectedDateTitle={selectedDateTitle}
            handleSelectedDate={handleSelectedDate}
            scrollMonthMinus={scrollMonthMinus}
            scrollMonthPlus={scrollMonthPlus}
          />
        </div>
      </form>
    </div>
  )
}

export default Date
