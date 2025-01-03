import './Slider.scss'

const Slider = ({ changeYear, changeMonth }) => {
  if (changeYear) {
    return <span className="slider-line slider-line-year"></span>
  }
  if (changeMonth) {
    return <span className="slider-line slider-line-month"></span>
  }
  if (!changeYear && !changeMonth) {
    return <span className="slider-line"></span>
  }
}

export default Slider
