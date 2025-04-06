import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import './SliderCardsList.scss'
import { sliderLetter } from '../../../redux/layout/actionCreators'

const SliderCardsList = ({
  value,
  infoCardsList,
  handleChangeFromSliderCardsList,
  maxCardsList,
}) => {
  const [widthToddler, setWidthToddler] = useState(null)
  const sliderRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (sliderRef.current) {
      const widthSlider = sliderRef.current.clientWidth
      setWidthToddler((widthSlider / infoCardsList.length) * maxCardsList)
    }
  }, [sliderRef, infoCardsList.length, maxCardsList])

  const discardOfTakes = () => {
    return infoCardsList.firstLetters.map((cardId, i, arr) => {
      const isFirstOrDifferent = i === 0 || cardId.letter !== arr[i - 1].letter
      const className = isFirstOrDifferent
        ? 'cards-list-letter'
        : 'cards-list-letter-default'

      return (
        <span
          key={i}
          className={className}
          onClick={handleClickLetter}
          data-id={cardId.id}
          data-index={cardId.index}
        >
          {isFirstOrDifferent ? cardId.letter : null}
        </span>
      )
    })
  }

  const handleClickLetter = (evt) => {
    dispatch(
      sliderLetter({
        letter: evt.target.textContent,
        id: evt.target.dataset.id,
        index: evt.target.dataset.index,
      })
    )
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
      <div className="cards-list-letters">{discardOfTakes()}</div>
    </div>
  )
}

export default SliderCardsList
