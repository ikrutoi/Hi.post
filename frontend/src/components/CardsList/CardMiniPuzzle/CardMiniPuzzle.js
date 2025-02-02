import { useCallback, useEffect, useRef, useState } from 'react'
import './CardMiniPuzzle.scss'
import SpanCircle from './SpanCircle/SpanCircle'
import cardMiniList from '../../../data/cardMiniList.json'
import sizeCardMini from '../../../data/ratioCardCardMini.json'
import imgEmpty from '../../../data/cardMiniBkg-260x183.png'

const CardMiniPuzzle = ({
  hover,
  dimensionHeight,
  listSelectedSections,
  calcHeightMinicard,
}) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  const [remSize, setRemSize] = useState(null)

  useEffect(() => {
    const root = document.documentElement
    const remSizeInPx = getComputedStyle(root).getPropertyValue('--rem-size')
    const tempDiv = document.createElement('div')
    tempDiv.style.width = remSizeInPx
    tempDiv.style.visibility = 'hidden'
    document.body.appendChild(tempDiv)
    const computedRem = tempDiv.getBoundingClientRect().width
    setRemSize(computedRem)
    document.body.removeChild(tempDiv)
  }, [])

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
