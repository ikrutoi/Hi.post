import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './CardPuzzle.scss'
// import sizeCard from '../../../data/ratioCardCardMini.json'
import Cardphoto from './Cardphoto/Cardphoto'
import Cardtext from './Cardtext/Cardtext'
import Envelope from './Envelope/Envelope'
import Aroma from './Aroma/Aroma'
import Date from './Date/Date'
import { addChoiceSection } from '../../../redux/layout/actionCreators'

const CardPuzzle = ({ toolbarColor }) => {
  const layoutChoiceSection = useSelector((state) => state.layout.choiceSection)
  const sizeCard = useSelector((state) => state.layout.sizeCard)

  const dispatch = useDispatch()
  const [choiceSection, setChoiceSection] = useState(null)

  useEffect(() => {
    dispatch(
      addChoiceSection({ source: 'cardPuzzle', nameSection: choiceSection })
    )
  }, [dispatch, choiceSection])

  const cardPuzzleRef = useRef(null)

  const section = (name) => {
    switch (name) {
      case 'cardphoto':
        return (
          <Cardphoto sizeCard={sizeCard} setChoiceSection={setChoiceSection} />
        )
      case 'cardtext':
        return (
          <Cardtext
            toolbarColor={toolbarColor}
            setChoiceSection={setChoiceSection}
            // setToolbarColorActive={setToolbarColorActive}
            // choiceBtnNav={choiceBtnNav}
          />
        )
      case 'envelope':
        return (
          <Envelope
            cardPuzzleRef={cardPuzzleRef.current}
            setChoiceSection={setChoiceSection}
          />
        )
      case 'aroma':
        return <Aroma setChoiceSection={setChoiceSection} />
      case 'date':
        return <Date setChoiceSection={setChoiceSection} />
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
