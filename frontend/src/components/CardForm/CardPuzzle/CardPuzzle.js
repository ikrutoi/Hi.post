import { useRef } from 'react'
import { useSelector } from 'react-redux'
import './CardPuzzle.scss'
// import sizeCard from '../../../data/ratioCardCardMini.json'
import Cardphoto from './Cardphoto/Cardphoto'
import Cardtext from './Cardtext/Cardtext'
import Envelope from './Envelope/Envelope'
import Aroma from './Aroma/Aroma'
import Date from './Date/Date'

const CardPuzzle = ({ dimensionHeight, toolbarColor }) => {
  const layoutChoiceSection = useSelector((state) => state.layout.choiceSection)
  const sizeCard = useSelector((state) => state.layout.sizeCard)
  // const heightCard = dimensionHeight * sizeCard.card
  // const widthCard = heightCard * 1.42
  // console.log('size from cardPuzzle', sizeCard)

  const cardPuzzleRef = useRef(null)

  const section = (name) => {
    switch (name) {
      case 'cardphoto':
        return <Cardphoto sizeCard={sizeCard} />
      case 'cardtext':
        return (
          <Cardtext
            toolbarColor={toolbarColor}
            // setToolbarColorActive={setToolbarColorActive}
            // choiceBtnNav={choiceBtnNav}
          />
        )
      case 'envelope':
        return <Envelope cardPuzzleRef={cardPuzzleRef.current} />
      case 'aroma':
        return <Aroma />
      case 'date':
        return <Date />
      default:
        break
    }
  }

  return (
    <div
      className="card-puzzle"
      ref={cardPuzzleRef}
      style={{
        width: `${sizeCard.width}px`,
        height: `${sizeCard.height}px`,
      }}
    >
      {section(layoutChoiceSection.nameSection)}
    </div>
  )
}

export default CardPuzzle
