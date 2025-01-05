// import { useState } from 'react'
import './Slider.scss'
import { currentDate } from '../../../../../utils/date/date'

const Slider = ({
  isActiveChangeYear,
  isActiveChangeMonth,
  selectedDateTitle,
  setSelectedDateTitle,
}) => {
  const handleChangeYear = (event) =>
    setSelectedDateTitle((state) => {
      return { ...state, year: event.target.value }
    })

  const handleChangeMonth = (event) =>
    setSelectedDateTitle((state) => {
      return { ...state, month: event.target.value }
    })

  if (isActiveChangeYear) {
    return (
      <>
        <input
          type="range"
          className="slider-line slider-line-year"
          min={currentDate.currentYear}
          max={currentDate.currentYear + 100}
          value={selectedDateTitle.year}
          onChange={handleChangeYear}
        ></input>
      </>
    )
  }
  if (isActiveChangeMonth) {
    return (
      <>
        <input
          type="range"
          className="slider-line slider-line-month"
          min="0"
          max="11"
          value={selectedDateTitle.month}
          onChange={handleChangeMonth}
        ></input>
      </>
    )
  }
  if (!isActiveChangeYear && !isActiveChangeMonth) {
    return <span className="slider-default"></span>
  }
}

export default Slider
