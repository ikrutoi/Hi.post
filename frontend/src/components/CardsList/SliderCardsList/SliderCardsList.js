import './SliderCardsList.scss'

const SliderCardsList = ({
  value,
  infoCardsList,
  handleChangeFromSliderCardsList,
}) => {
  return (
    <div className="cards-list-slider-container">
      <input
        type="range"
        className="cards-list-slider-line"
        min="1"
        max={infoCardsList.length}
        value={value}
        onChange={handleChangeFromSliderCardsList}
      ></input>
      <div className="cards-list-slider-letters"></div>
    </div>
  )
}

export default SliderCardsList
