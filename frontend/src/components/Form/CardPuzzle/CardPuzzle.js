import './CardPuzzle.scss'

const CardPuzzle = ({ name, dimensionHeight }) => {
  const heightCard = dimensionHeight * 0.9
  const widthCard = heightCard * 1.42
  return (
    <div
      className="card-puzzle"
      style={{ width: `${widthCard}px`, height: `${heightCard}px` }}
    >
      {name}
    </div>
  )
}

export default CardPuzzle
