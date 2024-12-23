import './CardPuzzle.scss'
import sizeCard from '../../../data/ratioCardCardMini.json'

const CardPuzzle = ({ name, dimensionHeight, dimensionWidth }) => {
  const heightCard = dimensionHeight * sizeCard.card
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
