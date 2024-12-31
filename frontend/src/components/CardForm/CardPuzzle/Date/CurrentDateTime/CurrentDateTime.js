import React, { useState, useEffect } from 'react'
import nameMonths from '../../../../../data/date/monthOfYear.json'

const CurrentDateTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  // console.log(currentTime.toDateString())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <span>{currentTime.getFullYear()}</span>
      <span>{nameMonths[currentTime.getMonth()]}</span>
      <span>{currentTime.getDate()}</span>
    </>
  )
}

export default CurrentDateTime
