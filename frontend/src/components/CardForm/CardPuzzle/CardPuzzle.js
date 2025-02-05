import './CardPuzzle.scss'
import sizeCard from '../../../data/ratioCardCardMini.json'
import Cardphoto from './Cardphoto/Cardphoto'
import Cardtext from './Cardtext/Cardtext'
import Envelope from './Envelope/Envelope'
import Aroma from './Aroma/Aroma'
import Date from './Date/Date'
import { useRef } from 'react'

const CardPuzzle = ({
  name,
  dimensionHeight,
  toolbarColor,
  setToolbarColorActive,
}) => {
  const heightCard = dimensionHeight * sizeCard.card
  const widthCard = heightCard * 1.42

  const cardPuzzleRef = useRef(null)

  const section = (name) => {
    switch (name) {
      case 'Cardphoto':
        return <Cardphoto dimensionHeight={dimensionHeight} />
      case 'Cardtext':
        return (
          <Cardtext
            toolbarColor={toolbarColor}
            setToolbarColorActive={setToolbarColorActive}
          />
        )
      case 'Envelope':
        return <Envelope cardPuzzleRef={cardPuzzleRef.current} />
      case 'Aroma':
        return <Aroma />
      case 'Date':
        return <Date />
      default:
        break
    }
  }

  return (
    <div
      className="card-puzzle"
      style={{ width: `${widthCard}px`, height: `${heightCard}px` }}
      ref={cardPuzzleRef}
    >
      {section(name)}
    </div>
  )
}

export default CardPuzzle
