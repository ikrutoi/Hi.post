import { useState } from 'react'
import './Calendar.scss'
import daysOfWeekStartFromMon from '../../../../../data/date/daysOfWeekStartFromMon.json'
import daysOfWeekStartFromSun from '../../../../../data/date/daysOfWeekStartFromSun.json'
import Cell from './Cell/Cell'
import CalendarWeekTitle from '../CalendarWeekTitle/CalendarWeekTitle'
import {
  currentDate,
  numberDaysInPreviousMonth,
  numberDaysInCurrentMonth,
  firstDayOfWeek,
} from '../../../../../utils/date/date'

const Calendar = ({
  selectedDateTitle,
  handleSelectedDate,
  selectedDate,
  handleScrollPlus,
  handleScrollMinus,
  scrollFromCalendar,
}) => {
  const [firstDayOfWeekTitle, setFirstDayOfWeek] = useState('Sun')
  const daysOfWeek =
    firstDayOfWeekTitle === 'Sun'
      ? daysOfWeekStartFromSun
      : daysOfWeekStartFromMon

  const daysInPreviousMonth = numberDaysInPreviousMonth(
    selectedDateTitle.year,
    selectedDateTitle.month,
    0
  )
  const daysInCurrentMonth = numberDaysInCurrentMonth(
    selectedDateTitle.year,
    selectedDateTitle.month
  )

  const constructionMonth = () => {
    let previousMonth = []
    for (
      let day = 0;
      day < firstDayOfWeek(firstDayOfWeekTitle, selectedDateTitle);
      day++
    ) {
      const currentDayInPreviousMonth = daysInPreviousMonth - day
      previousMonth.unshift(currentDayInPreviousMonth)
    }

    const dateTodayBefore = () => {
      let date = {}
      if (currentDate.currentMonth < 11) {
        date.year = currentDate.currentYear
        date.month = currentDate.currentMonth + 1
        return date
      }
      if (currentDate.currentMonth === 11) {
        date.year = currentDate.currentYear + 1
        date.month = 0
        return date
      }
    }

    const dateTodayAfter = () => {
      let date = {}
      if (currentDate.currentMonth > 0) {
        date.year = currentDate.currentYear
        date.month = currentDate.currentMonth - 1
        return date
      }
      if (currentDate.currentMonth === 0) {
        date.year = currentDate.currentYear - 1
        date.month = 11
        return date
      }
    }

    const dateSelectedBefore = () => {
      let date = {}
      if (selectedDate.month < 11) {
        date.year = selectedDate.year
        date.month = selectedDate.month + 1
        return date
      }
      if (selectedDate.month === 11) {
        date.year = selectedDate.year + 1
        date.month = 0
        return date
      }
    }

    const dateSelectedAfter = () => {
      let date = {}
      if (selectedDate.month > 0) {
        date.year = selectedDate.year
        date.month = selectedDate.month - 1
        return date
      }
      if (selectedDate.month === 0) {
        date.year = selectedDate.year - 1
        date.month = 11
        return date
      }
    }

    const month = previousMonth.map((day) => {
      return (
        <Cell
          key={`day-before-${day}`}
          today={
            day === currentDate.currentDay &&
            selectedDateTitle.month === dateTodayBefore().month &&
            selectedDateTitle.year === dateTodayBefore().year
              ? true
              : false
          }
          dayBefore={day}
          selectedDate={
            !!selectedDate &&
            selectedDateTitle.month === dateSelectedBefore().month &&
            selectedDateTitle.year === dateSelectedBefore().year &&
            selectedDateTitle.day === day
              ? true
              : false
          }
          selectedDateTitle={selectedDateTitle}
          handleScrollMinus={handleScrollMinus}
          scrollFromCalendar={scrollFromCalendar}
        />
      )
    })
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      month.push(
        <Cell
          key={`day-${day}`}
          today={
            day === currentDate.currentDay &&
            selectedDateTitle.month === currentDate.currentMonth &&
            selectedDateTitle.year === currentDate.currentYear
              ? true
              : false
          }
          currentDate={currentDate}
          dayCurrent={day}
          handleSelectedDate={handleSelectedDate}
          selectedDate={
            !!selectedDate &&
            selectedDate.year === selectedDateTitle.year &&
            selectedDate.month === selectedDateTitle.month &&
            selectedDate.day === day
              ? true
              : false
          }
          selectedDateTitle={selectedDateTitle}
        />
      )
    }
    const numberOfDaysRemaining = 42 - month.length
    for (let day = 1; day <= numberOfDaysRemaining; day++) {
      month.push(
        <Cell
          key={`day-after-${day}`}
          today={
            day === currentDate.currentDay &&
            selectedDateTitle.month === dateTodayAfter().month &&
            selectedDateTitle.year === dateTodayAfter().year
              ? true
              : false
          }
          dayAfter={day}
          selectedDate={
            !!selectedDate &&
            selectedDateTitle.month === dateSelectedAfter().month &&
            selectedDateTitle.year === dateSelectedAfter().year &&
            selectedDateTitle.day === day
              ? true
              : false
          }
          selectedDateTitle={selectedDateTitle}
          handleScrollPlus={handleScrollPlus}
          scrollFromCalendar={scrollFromCalendar}
        />
      )
    }

    return month
  }

  return (
    <div className="calendar">
      <CalendarWeekTitle
        daysOfWeek={daysOfWeek}
        firstDayTitle={firstDayOfWeekTitle}
        setFirstDayOfWeek={setFirstDayOfWeek}
      />
      <div className="calendar-month">
        <div className="month-days">{constructionMonth()}</div>
      </div>
    </div>
  )
}

export default Calendar
