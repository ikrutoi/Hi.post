import { useRef } from 'react'
import { useSelector } from 'react-redux'
import './CardPuzzle.scss'
// import sizeCard from '../../../data/ratioCardCardMini.json'
import Cardphoto from './Cardphoto/Cardphoto'
import Cardtext from './Cardtext/Cardtext'
import Envelope from './Envelope/Envelope'
import Aroma from './Aroma/Aroma'
import Date from './Date/Date'

const CardPuzzle = ({ toolbarColor }) => {
  const infoChoiceSection = useSelector((state) => state.layout.choiceSection)
  const infoChoiceClip = useSelector((state) => state.layout.choiceClip)
  const sizeCard = useSelector((state) => state.layout.sizeCard)

  const cardPuzzleRef = useRef(null)

  const section = (name) => {
    switch (name) {
      case 'cardphoto':
        return (
          <Cardphoto
            sizeCard={sizeCard}
            choiceSection={infoChoiceSection}
            choiceClip={infoChoiceClip}
          />
        )
      case 'cardtext':
        return (
          <Cardtext
            toolbarColor={toolbarColor}
            styleLeftCardPuzzle={
              cardPuzzleRef.current
                ? cardPuzzleRef.current.getBoundingClientRect().left
                : 0
            }
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
      {section(infoChoiceSection.nameSection)}
    </div>
  )
}

export default CardPuzzle
