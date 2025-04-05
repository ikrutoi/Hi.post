import { useEffect, useRef, useState } from 'react'
import './SliderCardsList.scss'

const SliderCardsList = ({
  value,
  infoCardsList,
  handleChangeFromSliderCardsList,
  maxCardsList,
}) => {
  const [widthToddler, setWidthToddler] = useState(null)
  const sliderRef = useRef()

  useEffect(() => {
    if (sliderRef.current) {
      const widthSlider = sliderRef.current.clientWidth
      setWidthToddler((widthSlider / infoCardsList.length) * maxCardsList)
    }
  }, [sliderRef, infoCardsList.length, maxCardsList])

  const discardOfTakes = (letter, i, arr) => {
    if (i !== 0) {
      return letter === arr[i - 1] ? '' : letter
    } else {
      return letter
    }
  }

  return (
    <div className="cards-list-slider-container" ref={sliderRef}>
      {widthToddler && (
        <style>
          {`
        .cards-list-slider::-webkit-slider-thumb {
          width: ${widthToddler}px}`}
        </style>
      )}
      <input
        type="range"
        className="cards-list-slider"
        min="1"
        max={infoCardsList.length}
        value={value}
        onChange={handleChangeFromSliderCardsList}
      ></input>
      <div className="cards-list-letters">
        {infoCardsList.firstLetters.map((letter, i, arr) => {
          return (
            <span key={i} className="cards-list-letter">
              {discardOfTakes(letter, i, arr)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default SliderCardsList
