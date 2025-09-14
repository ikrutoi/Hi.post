import React, { useEffect } from 'react'
import './Date.scss'

import {
  Toolbar,
  Switcher,
  Calendar,
  Slider,
} from '@features/date/presentation'

import { currentDate } from '@features/date/calendar/domain/currentDate'
import { useDateFacade } from '@features/date/application/facades/useDateFacade'
import { useCartPreviewForCalendar } from '@features/date/preview/application/useCartPreviewForCalendar'
import { useDateController } from '@features/date/switcher/application/useDateController'
import { useLayoutActiveFacade } from '@features/layout/application/facades/useLayoutActiveFacade'
import { formatDispatchDate, isCompleteDate } from '@entities/date/utils'
import { MONTH_NAMES } from '@entities/date/constants'

import { themeColors } from 'shared-legacy/theme/themeColors'
import { LuCalendar, LuCalendarArrowUp } from 'react-icons/lu'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Date: React.FC = () => {
  const { dispatchDate, setDispatchDate } = useDateFacade()
  const { activeSections, setActiveSection } = useLayoutActiveFacade()

  const {
    state: { selectedDateTitle, selectedDate, activeDateTitleRole },
    actions: {
      setSelectedDate,
      updateDateTitleField,
      toggleActiveDateRole,
      goToTodayDate,
      goToSelectedDate,
      handleCalendarCellClick,
      handleDecrementArrow,
      handleIncrementArrow,
      handleSliderChange,
    },
    derived: { isCurrentMonth },
  } = useDateController(dispatchDate)

  const { cartPreview } = useCartPreviewForCalendar(
    isCompleteDate(selectedDateTitle)
      ? `${selectedDateTitle.year}-${selectedDateTitle.month}-${selectedDateTitle.day}`
      : null
  )

  useEffect(() => {
    if (selectedDate.isSelected) {
      setActiveSection({ ...activeSections, date: true })
    }
  }, [selectedDate])

  const handleSelectedDate = (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => {
    if (!isTaboo) {
      const newDate = { isSelected: true, year, month, day }
      setSelectedDate(newDate)
      setDispatchDate(newDate)
    }
  }

  return (
    <div className="date">
      <div className="date__nav-container">
        <Toolbar isDateActive={activeSections.date} />
      </div>

      <form className="date__form">
        <div className="date__header">
          <div className="date__header-side">
            <div
              className={`date__today-selected ${
                isCurrentMonth() ? 'date__today-selected--disabled' : ''
              }`}
              onClick={goToTodayDate}
              style={{
                color: isCurrentMonth()
                  ? themeColors.text.secondary
                  : themeColors.text.primary,
                cursor: isCurrentMonth() ? 'default' : 'pointer',
              }}
            >
              <LuCalendar className="date__icon-title" />
              {`${currentDate.currentYear} ${MONTH_NAMES[currentDate.currentMonth]} ${currentDate.currentDay}`}
            </div>
          </div>

          <div className="date__header-center">
            <div
              className="date__arrow-button"
              style={{
                color: activeDateTitleRole
                  ? themeColors.text.primary
                  : themeColors.text.secondary,
                backgroundColor: themeColors.background.default,
                cursor: 'pointer',
              }}
              onClick={handleDecrementArrow}
            >
              <FaChevronLeft className="date__icon-arrow" />
            </div>

            <div className="date__switcher">
              <Switcher
                selectedDateTitle={selectedDateTitle}
                activeDateTitleRole={activeDateTitleRole}
                onToggleRole={toggleActiveDateRole}
              />
            </div>

            <div
              className="date__arrow-button"
              style={{
                color: activeDateTitleRole
                  ? themeColors.text.primary
                  : themeColors.text.secondary,
                backgroundColor: themeColors.background.default,
                cursor: 'pointer',
              }}
              onClick={handleIncrementArrow}
            >
              <FaChevronRight className="date__icon-arrow" />
            </div>
          </div>

          <div className="date__header-side">
            <div className="date__selected" onClick={goToSelectedDate}>
              {selectedDate.isSelected && (
                <LuCalendarArrowUp className="date__icon-title" />
              )}
              {formatDispatchDate(selectedDate)}
            </div>
          </div>
        </div>

        <div className="date__slider">
          <Slider
            selectedDateTitle={selectedDateTitle}
            activeDateTitleRole={activeDateTitleRole}
            onChange={handleSliderChange}
          />
        </div>

        <div className="date__calendar">
          <Calendar
            date={selectedDate}
            selectedDateTitle={selectedDateTitle}
            handleSelectedDate={handleSelectedDate}
            handleClickCell={handleCalendarCellClick}
            cart={cartPreview}
          />
        </div>
      </form>
    </div>
  )
}

export default Date
