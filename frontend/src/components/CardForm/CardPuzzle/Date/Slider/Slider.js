import { useState } from 'react'
import './Slider.scss'
import { currentDate } from '../../../../../utils/date/date'

const Slider = ({ changeYear, changeMonth, selectedDate }) => {
  const [valueYear, setValueYear] = useState(selectedDate.year)
  const [valueMonth, setValueMonth] = useState(selectedDate.month)

  const handleChangeYear = (event) => setValueYear(event.target.value)
  const handleChangeMonth = (event) => setValueMonth(event.target.value)

  if (changeYear) {
    return (
      <>
        <input
          type="range"
          className="slider-line slider-line-year"
          min={currentDate.currentYear}
          max={currentDate.currentYear + 100}
          value={valueYear}
          onChange={handleChangeYear}
        ></input>
      </>
    )
  }
  if (changeMonth) {
    return (
      <>
        <input
          type="range"
          className="slider-line slider-line-month"
          min="0"
          max="11"
          value={valueMonth}
          onChange={handleChangeMonth}
        ></input>
      </>
    )
  }
  if (!changeYear && !changeMonth) {
    return <span className="slider-default"></span>
  }
}

export default Slider
