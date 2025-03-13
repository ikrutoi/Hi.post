// import { useState } from 'react'
import './Slider.scss'
import { currentDate } from '../../../../../utils/date/date'

const Slider = ({
  selectedDateTitle,
  handleChangeDateFromSlider,
  isActiveDateTitle,
}) => {
  if (isActiveDateTitle) {
    switch (isActiveDateTitle) {
      case 'year':
        return (
          <>
            <input
              type="range"
              className="slider-line slider-line-year"
              min={currentDate.currentYear}
              max={currentDate.currentYear + 100}
              value={selectedDateTitle.year}
              onChange={(event) =>
                handleChangeDateFromSlider('year', event.target.value)
              }
            ></input>
          </>
        )
      case 'month':
        return (
          <>
            <input
              type="range"
              className="slider-line slider-line-month"
              min="0"
              max="11"
              value={selectedDateTitle.month}
              onChange={(event) =>
                handleChangeDateFromSlider('month', event.target.value)
              }
            ></input>
          </>
        )

      default:
        break
    }
  } else {
    return <span className="slider-default"></span>
  }
}

export default Slider
