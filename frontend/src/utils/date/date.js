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

const numberDaysInPreviousMonth = (year, month) =>
  new Date(year, month, 0).getDate()

const numberDaysInCurrentMonth = (year, month) => {
  if (month !== 11) {
    month++
  } else {
    month = 0
    year++
  }
  return new Date(year, month, 0).getDate()
}

const daysInCurrentMonth = new Date(
  yearForCurrentDaysInMonth,
  monthForCurrentDaysInMonth,
  0
).getDate()

const firstDayOfWeek = (firstDay, selectedDate) => {
  return firstDay === 'Sun'
    ? new Date(selectedDate.year, selectedDate.month, 1).getDay()
    : new Date(selectedDate.year, selectedDate.month, 1).getDay() === 0
    ? 6
    : new Date(selectedDate.year, selectedDate.month, 1).getDay() - 1
}

// import React, { useState, useEffect } from 'react'
// const [currentTime, setCurrentTime] = useState(new Date())

// console.log(currentTime.toDateString())

// useEffect(() => {
//   const timer = setInterval(() => {
//     setCurrentTime(new Date())
//   }, 60000)

//   return () => clearInterval(timer)
// }, [])

export {
  currentDate,
  daysInCurrentMonth,
  numberDaysInPreviousMonth,
  numberDaysInCurrentMonth,
  firstDayOfWeek,
}
