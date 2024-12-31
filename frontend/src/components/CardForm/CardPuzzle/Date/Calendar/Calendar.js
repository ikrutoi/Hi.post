import { useState } from 'react'
import './Calendar.scss'
import daysOfWeekStartFromMon from '../../../../../data/date/daysOfWeekStartFromMon.json'
import daysOfWeekStartFromSun from '../../../../../data/date/daysOfWeekStartFromSun.json'
import Week from '../Week/Week'

const Calendar = () => {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('Sun')
  const daysOfWeek =
    firstDayOfWeek === 'Sun' ? daysOfWeekStartFromSun : daysOfWeekStartFromMon
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const currentDay = new Date().getDate()
  const currentDayOfWeek = new Date().getDay()
  const currentDate = {
    currentYear,
    currentMonth,
    currentDay,
    currentDayOfWeek,
  }

  let yearForCurrentDaysInMonth
  let monthForCurrentDaysInMonth
  if (currentMonth !== 11) {
    monthForCurrentDaysInMonth = currentMonth + 1
    yearForCurrentDaysInMonth = currentYear
  } else {
    monthForCurrentDaysInMonth = 0
    yearForCurrentDaysInMonth = currentYear + 1
  }

  const daysInPreviousMonth = new Date(currentYear, currentMonth, 0)
  const daysInCurrentMonth = new Date(
    yearForCurrentDaysInMonth,
    monthForCurrentDaysInMonth,
    0
  ).getDate()
  const firstDayOfMonth =
    firstDayOfWeek === 'Sun'
      ? new Date(currentYear, currentMonth, 1).getDay()
      : new Date(currentYear, currentMonth, 1).getDay() === 0
      ? 6
      : new Date(currentYear, currentMonth, 1).getDay() - 1

  const constructionMonth = () => {
    // const lengthFirstWeek = 7 - firstDayOfMonth
    // const numberWeeksInMonth =
    //   Math.ceil((daysInCurrentMonth - lengthFirstWeek) / 7) + 1
    // console.log(numberWeeksInMonth)
    // console.log(firstDayOfMonth)
    // const currentDaysOfMonth =
    let month = []
    for (let week = 0; week < 7; week++) {
      month.push(
        <Week
          key={`week-${week}`}
          firstDayOfMonth={firstDayOfMonth}
          weekInMonth={week}
          daysOfWeek={daysOfWeek}
        />
      )
    }
    return month
  }

  return <div className="calendar">{constructionMonth()}</div>
}

export default Calendar
