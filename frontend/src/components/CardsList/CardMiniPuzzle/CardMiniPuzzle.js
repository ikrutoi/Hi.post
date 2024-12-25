import './CardMiniPuzzle.scss'
import SpanCircle from './SpanCircle/SpanCircle'
import cardMiniList from '../../../data/cardMiniList.json'
import sizeCardMini from '../../../data/ratioCardCardMini.json'
import imgEmpty from '../../../data/photo-start-265-190.jpg'

const CardMiniPuzzle = ({ hover, dimensionHeight }) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  return (
    <div
      className="card-mini-puzzle"
      style={{ width: `${widthCardMini}px`, height: `${heightCardMini}px` }}
    >
      <img className="img-card-mini" alt="postcard mini" src={imgEmpty} />
      <div className="card-mini-circles">
        {cardMiniList.map((name, i) => (
          <SpanCircle name={name} key={i} hover={hover} />
        ))}
      </div>
    </div>
  )
}

export default CardMiniPuzzle
