import './CardMiniPuzzle.scss'
import cardMiniList from '../../../data/cardMiniList.json'
import SpanCircle from './SpanCircle/SpanCircle'
import sizeCardMini from '../../../data/ratioCardCardMini.json'

const CardMiniPuzzle = ({ hover, dimensionHeight }) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  return (
    <div
      className="card-mini-puzzle"
      style={{ width: `${widthCardMini}px`, height: `${heightCardMini}px` }}
    >
      <div className="card-mini-circles">
        {cardMiniList.map((name, i) => (
          <SpanCircle name={name} key={i} hover={hover} />
        ))}
      </div>
    </div>
  )
}

export default CardMiniPuzzle
