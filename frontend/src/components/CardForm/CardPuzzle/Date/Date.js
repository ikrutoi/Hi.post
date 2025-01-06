import { useState } from 'react'
import './Date.scss'
import Calendar from './Calendar/Calendar'
import CurrentDateTime from './CurrentDateTime/CurrentDateTime'
import { currentDate } from '../../../../utils/date/date'
import Slider from './Slider/Slider'
import nameMonths from '../../../../data/date/monthOfYear.json'

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

  const clearActiveDateTitleAndSlider = () => {
    if (isActiveChangeMonth) {
      setIsActiveChangeMonth(false)
    }
    if (isActiveChangeYear) {
      setIsActiveChangeYear(false)
    }
    if (setIsActiveDateTitle) {
      setIsActiveDateTitle(false)
    }
  }

  const handleSelectedDate = (selectedYear, selectedMonth, selectedDay) => {
    clearActiveDateTitleAndSlider()
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

  const changeMonthTitleMinus = () => {
    clearActiveDateTitleAndSlider()
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

  const handleChangeDateFromSlider = (sectionDate, value) => {
    switch (sectionDate) {
      case 'year':
        setSelectedDateTitle((state) => {
          return { ...state, year: value }
        })
        break
      case 'month':
        setSelectedDateTitle((state) => {
          return { ...state, month: value }
        })
        break
      default:
        break
    }
  }

  const handleScrollMinus = () => {
    if (isActiveChangeYear) {
      setSelectedDateTitle((state) => {
        return { ...state, year: selectedDateTitle.year - 1 }
      })
    }
    if (isActiveChangeMonth) {
      changeMonthTitleMinus()
    }
  }

  const changeMonthTitlePlus = () => {
    clearActiveDateTitleAndSlider()
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

  const handleScrollPlus = () => {
    if (isActiveChangeYear) {
      setSelectedDateTitle((state) => {
        return { ...state, year: selectedDateTitle.year + 1 }
      })
    }
    if (isActiveChangeMonth) {
      changeMonthTitlePlus()
    }
  }

  const handleTransitionTodayDate = () => {
    setSelectedDateTitle((state) => {
      return {
        ...state,
        year: currentDate.currentYear,
        month: currentDate.currentMonth,
      }
    })
  }

  const handleTransitionSelectedDate = () => {
    setSelectedDateTitle((state) => {
      return {
        ...state,
        year: selectedDate.year,
        month: selectedDate.month,
      }
    })
  }

  return (
    <div className="date">
      <form className="date-form">
        <div className="date-header">
          <div className="header-left-right">
            <div
              className="header-today-selected header-today ${
                disabledDateToday"
              onClick={handleTransitionTodayDate}
            >
              {selectedDateTitle.year === currentDate.currentYear &&
              selectedDateTitle.month === currentDate.currentMonth
                ? ''
                : `${currentDate.currentYear} ${
                    nameMonths[currentDate.currentMonth]
                  } ${currentDate.currentDay}`}
            </div>
          </div>
          <div className="header-center">
            <div className="header-sign" onClick={handleScrollMinus}>
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
            <div className="header-sign" onClick={handleScrollPlus}>
              Right
            </div>
          </div>
          <div className="header-left-right">
            <div
              className="header-today-selected header-selected"
              onClick={handleTransitionSelectedDate}
            >
              {selectedDate
                ? `${selectedDate.year} ${nameMonths[selectedDate.month]} ${
                    selectedDate.day
                  }`
                : ''}
            </div>
          </div>
        </div>
        <div className="date-slider">
          <Slider
            selectedDateTitle={selectedDateTitle}
            isActiveChangeYear={isActiveChangeYear}
            isActiveChangeMonth={isActiveChangeMonth}
            handleChangeDateFromSlider={handleChangeDateFromSlider}
          />
        </div>
        <div className="date-calendar">
          <Calendar
            selectedDate={selectedDate}
            selectedDateTitle={selectedDateTitle}
            handleSelectedDate={handleSelectedDate}
            changeMonthTitlePlus={changeMonthTitlePlus}
            changeMonthTitleMinus={changeMonthTitleMinus}
          />
        </div>
      </form>
    </div>
  )
}

export default Date
