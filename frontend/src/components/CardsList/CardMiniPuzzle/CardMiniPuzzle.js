import { useCallback, useEffect, useRef, useState } from 'react'
import './CardMiniPuzzle.scss'
import SpanCircle from './SpanCircle/SpanCircle'
import cardMiniList from '../../../data/cardMiniList.json'
import sizeCardMini from '../../../data/ratioCardCardMini.json'
import imgEmpty from '../../../data/cardFormNav/miniPuzzle.png'
import { useSelector } from 'react-redux'
// import imgEmpty from '../../../data/cardMiniBkg-260x183.png'

const CardMiniPuzzle = ({
  hover,
  dimensionHeight,
  listSelectedSections,
  calcHeightMinicard,
}) => {
  const selectors = useSelector((state) => state.layout)
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  const [remSize, setRemSize] = useState(null)

  useEffect(() => {
    if (selectors.remSize) {
      setRemSize(selectors.remSize)
    }
  }, [selectors])

  const cardPuzzleRef = useRef(null)

  const updateHeight = useCallback(() => {
    if (remSize && cardPuzzleRef.current) {
      const newHeight = cardPuzzleRef.current.clientHeight - remSize
      calcHeightMinicard(newHeight)
    }
  }, [remSize, calcHeightMinicard])

  useEffect(() => {
    updateHeight()
  }, [updateHeight])

  return (
    <div
      ref={cardPuzzleRef}
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
