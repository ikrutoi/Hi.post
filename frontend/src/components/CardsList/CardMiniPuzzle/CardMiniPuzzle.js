import './CardMiniPuzzle.scss'
import SpanCircle from './SpanCircle/SpanCircle'
import cardMiniList from '../../../data/cardMiniList.json'
import sizeCardMini from '../../../data/ratioCardCardMini.json'
import imgEmpty from '../../../data/cardMiniBkg-260x183.png'

const CardMiniPuzzle = ({ hover, dimensionHeight, listSelectedSections }) => {
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
          <SpanCircle
            listSelectedSections={listSelectedSections}
            name={name}
            key={`${name}-${i}`}
            hover={hover}
          />
        ))}
      </div>
    </div>
  )
}

export default CardMiniPuzzle
