import './SpanCircle.scss'

const SpanCircle = ({ name, hover }) => {
  const circles = document.querySelectorAll('.card-mini-circle')
  circles.forEach((el) => {
    if (el.classList.contains('hover')) el.classList.remove('hover')
  })

  return !!hover && name === hover ? (
    <span className={`card-mini-circle circle-${name.toLowerCase()} hover`} />
  ) : (
    <span className={`card-mini-circle circle-${name.toLowerCase()}`} />
  )
}

export default SpanCircle
