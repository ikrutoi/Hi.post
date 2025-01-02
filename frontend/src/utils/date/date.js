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

const numberDaysInPreviousMonth = new Date(
  currentYear,
  currentMonth,
  0
).getDate()
const daysInCurrentMonth = new Date(
  yearForCurrentDaysInMonth,
  monthForCurrentDaysInMonth,
  0
).getDate()

// import React, { useState, useEffect } from 'react'
// const [currentTime, setCurrentTime] = useState(new Date())

// console.log(currentTime.toDateString())

// useEffect(() => {
//   const timer = setInterval(() => {
//     setCurrentTime(new Date())
//   }, 60000)

//   return () => clearInterval(timer)
// }, [])

export { currentDate, numberDaysInPreviousMonth, daysInCurrentMonth }
