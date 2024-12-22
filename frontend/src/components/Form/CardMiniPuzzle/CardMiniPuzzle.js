import './CardMiniPuzzle.scss'
import cardMiniList from '../../../data/cardMiniList.json'
import SpanCircle from './SpanCircle/SpanCircle'

const CardMiniPuzzle = ({ hover, dimensionHeight }) => {
  const heightCardMini = dimensionHeight * 0.12
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
