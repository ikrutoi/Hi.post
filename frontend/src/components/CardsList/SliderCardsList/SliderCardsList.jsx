import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './SliderCardsList.scss'
import { setSliderLetter, setDeltaEnd } from '../../../store/slices/layoutSlice'

const SliderCardsList = ({
  value,
  infoCardsList,
  handleChangeFromSliderCardsList,
  maxCardsList,
}) => {
  const [widthToddler, setWidthToddler] = useState(null)
  const sliderRef = useRef()
  const [indexLetter, setClickLetter] = useState(0)
  const infoDeltaEnd = useSelector((state) => state.layout.setDeltaEnd)
  const dispatch = useDispatch()

  useEffect(() => {
    if (infoCardsList.length && indexLetter) {
      const currentDeltaEnd = infoCardsList.length - indexLetter
      if (currentDeltaEnd <= maxCardsList) {
        dispatch(setDeltaEnd(true))
      } else {
        dispatch(setDeltaEnd(false))
      }
    }
  }, [infoCardsList.length, indexLetter, maxCardsList, dispatch])

  useEffect(() => {
    if (sliderRef.current) {
      const widthSlider = sliderRef.current.clientWidth
      setWidthToddler(
        (widthSlider / infoCardsList.length) *
          (infoDeltaEnd ? maxCardsList : maxCardsList - 1)
      )
    }
    // }, [sliderRef, maxCardsList, infoDeltaEnd, infoCardsList])
  }, [])

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

  const getWidth = () => {
    if (sliderRef.current) {
      const widthSlider = sliderRef.current.clientWidth
      return (
        (widthSlider / infoCardsList.length) *
        (infoDeltaEnd ? maxCardsList : maxCardsList - 1)
      )
    }
  }

  const handleClickLetter = (evt) => {
    if (evt.target.textContent) {
      dispatch(
        setSliderLetter({
          letter: evt.target.textContent,
          id: evt.target.dataset.id,
          index: evt.target.dataset.index,
        })
      )
      setClickLetter(evt.target.dataset.index)
      handleChangeFromSliderCardsList(evt.target.dataset.index)
    }
  }

  return (
    <div className="cards-list-slider-container" ref={sliderRef}>
      {widthToddler && (
        <style>
          {`
        .cards-list-slider::-webkit-slider-thumb {
          width: ${getWidth()}px}`}
        </style>
      )}
      <input
        type="range"
        className="cards-list-slider"
        min="0"
        max={infoCardsList.length - maxCardsList + 1}
        value={(infoDeltaEnd ? value + 1 : value) || 0}
        onChange={(evt) => handleChangeFromSliderCardsList(evt.target.value)}
      ></input>
      {/* <div className="range-ticks">
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
        <span className="range-tick"></span>
      </div> */}
      <div className="cards-list-letters">{discardOfTakes()}</div>
    </div>
  )
}

export default SliderCardsList
