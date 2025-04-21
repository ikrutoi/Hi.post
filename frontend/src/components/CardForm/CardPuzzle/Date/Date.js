import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
  FaAngleLeft,
  FaAngleRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import {
  LuCalendarArrowUp,
  LuCalendarArrowDown,
  LuCalendar,
} from 'react-icons/lu'
import './Date.scss'
import { addDate } from '../../../../redux/cardEdit/actionCreators'
import Calendar from './Calendar/Calendar'
import CurrentDateTime from './CurrentDateTime/CurrentDateTime'
import { currentDate } from '../../../../utils/date/date'
import Slider from './Slider/Slider'
import nameMonths from '../../../../data/date/monthOfYear.json'
import {
  activeSections,
  addChoiceSection,
} from '../../../../redux/layout/actionCreators'
import ToolbarDate from './ToolbarDate/ToolbarDate'
import { colorSchemeMain } from '../../../../data/main/colorSchemeMain'
import { searchParent } from '../../../../utils/searchParent'

const Date = () => {
  // const fullCard = useSelector((state) => state.layout.fullCard)
  const cardEditDate = useSelector((state) => state.cardEdit.date)
  const selectorActiveSections = useSelector(
    (state) => state.layout.activeSections
  )
  const inputValueSelectedDate = cardEditDate
    ? cardEditDate
    : {
        year: currentDate.currentYear,
        month: currentDate.currentMonth,
        day: currentDate.currentDay,
      }
  const dispatch = useDispatch()
  const [selectedDateTitle, setSelectedDateTitle] = useState(
    inputValueSelectedDate
  )
  const [selectedDate, setSelectedDate] = useState(null)
  const [isActiveDateTitle, setIsActiveDateTitle] = useState(false)

  useEffect(() => {
    cardEditDate ? setSelectedDate(cardEditDate) : setSelectedDate(null)
    if (!cardEditDate) {
      setIsActiveDateTitle(false)
    }
  }, [cardEditDate])

  const handleSelectedDate = (
    taboo,
    selectedYear,
    selectedMonth,
    selectedDay
  ) => {
    if (!taboo) {
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
      dispatch(
        addDate({
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay,
        })
      )
      // setChoiceSection('date')
    }
  }

  useEffect(() => {
    if (selectedDate) {
      dispatch(
        activeSections({
          ...selectorActiveSections,
          date: Boolean(selectedDate),
        })
      )
    }
  }, [selectedDate, dispatch])

  const handleChangeTitle = (evt) => {
    const parentElement = searchParent(evt.target, 'date-title')
    if (isActiveDateTitle === parentElement.dataset.name) {
      setIsActiveDateTitle(false)
    } else {
      setIsActiveDateTitle(parentElement.dataset.name)
    }
  }

  const changeMonthTitleMinus = () => {
    // clearActiveDateTitleAndSlider()
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

  const handleArrowMinus = () => {
    if (!isActiveDateTitle) {
      setIsActiveDateTitle('month')
    }
    switch (isActiveDateTitle) {
      case 'year':
        setSelectedDateTitle((state) => {
          return { ...state, year: selectedDateTitle.year - 1 }
        })
        break
      case 'month':
        changeMonthTitleMinus()
        break
      default:
        break
    }
  }

  const changeMonthTitlePlus = () => {
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

  const handleClickCell = (month) => {
    switch (month) {
      case 'before':
        changeMonthTitleMinus()
        break
      case 'after':
        changeMonthTitlePlus()
        break
      default:
        break
    }
  }

  const handleArrowPlus = () => {
    if (!isActiveDateTitle) {
      setIsActiveDateTitle('month')
    }
    switch (isActiveDateTitle) {
      case 'year':
        setSelectedDateTitle((state) => {
          return { ...state, year: selectedDateTitle.year + 1 }
        })
        break
      case 'month':
        changeMonthTitlePlus()
        break
      default:
        break
    }
    // }
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

  const checkingCurrentMonth = () => {
    return (
      selectedDateTitle.year === currentDate.currentYear &&
      selectedDateTitle.month === currentDate.currentMonth
    )
  }

  return (
    <div className="date">
      <div className="nav-container nav-container-date">
        <ToolbarDate />
      </div>
      <form className="date-form">
        <div className="date-header">
          <div className="header-left-right">
            <div
              className="header-today-selected header-today"
              onClick={handleTransitionTodayDate}
              style={{
                color: checkingCurrentMonth()
                  ? colorSchemeMain.mediumGray
                  : colorSchemeMain.gray,
                cursor: checkingCurrentMonth() ? 'default' : 'pointer',
              }}
            >
              <LuCalendar className="icon-title-date" />
              {`${currentDate.currentYear} ${
                nameMonths[currentDate.currentMonth]
              } ${currentDate.currentDay}`}
            </div>
          </div>
          <div className="header-center">
            <div
              className="header-sign"
              style={{
                color: isActiveDateTitle
                  ? colorSchemeMain.gray
                  : colorSchemeMain.mediumGray,
                backgroundColor: colorSchemeMain.lightGray,
                cursor: 'pointer',
              }}
              onClick={handleArrowMinus}
            >
              <FaChevronLeft className="icon-date" />
            </div>
            <div className="header-date">
              <CurrentDateTime
                selectedDateTitle={selectedDateTitle}
                isActiveDateTitle={isActiveDateTitle}
                handleChangeTitle={handleChangeTitle}
              />
            </div>
            <div
              className="header-sign"
              style={{
                color: isActiveDateTitle
                  ? colorSchemeMain.gray
                  : colorSchemeMain.mediumGray,
                backgroundColor: colorSchemeMain.lightGray,
                cursor: 'pointer',
              }}
              onClick={handleArrowPlus}
            >
              <FaChevronRight className="icon-date" />
            </div>
          </div>
          <div className="header-left-right">
            <div
              className="header-today-selected header-selected"
              onClick={handleTransitionSelectedDate}
            >
              {selectedDate ? (
                <LuCalendarArrowUp className="icon-title-date" />
              ) : (
                ''
              )}
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
            isActiveDateTitle={isActiveDateTitle}
            handleChangeDateFromSlider={handleChangeDateFromSlider}
          />
        </div>
        <div className="date-calendar">
          <Calendar
            selectedDate={selectedDate}
            selectedDateTitle={selectedDateTitle}
            handleSelectedDate={handleSelectedDate}
            handleClickCell={handleClickCell}
          />
        </div>
      </form>
    </div>
  )
}

export default Date
