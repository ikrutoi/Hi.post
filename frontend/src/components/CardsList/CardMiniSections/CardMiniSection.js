import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import './CardMiniSection.scss'
import MiniCardtext from './MiniCardtext/MiniCardtext'
import MiniEnvelope from './MiniEnvelope/MiniEnvelope'
import MiniDate from './MiniDate/MiniDate'
import MiniAroma from './MiniAroma/MiniAroma'
import MiniPhoto from './MiniPhoto/MiniPhoto'
import { addChoiceSection } from '../../../redux/layout/actionCreators'

const CardMiniSection = ({
  valueSection,
  sizeCardMini,
  polyCards,
  sectionInfo,
}) => {
  const cardMiniSectionRef = useRef(null)
  const dispatch = useDispatch()
  const choiceSection = useSelector((state) => state.layout.choiceSection)

  const handleClickSection = (evt) => {
    const parentName = evt.target.closest('.card-mini-section').dataset.name
    dispatch(
      addChoiceSection({ source: 'miniCardPuzzle', nameSection: parentName })
    )
  }

  const renderSection = (section, valueSection) => {
    switch (section) {
      case 'cardphoto':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniPhoto sizeCardMini={sizeCardMini} />
          </div>
        )
      case 'cardtext':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniCardtext
              heightMinicard={sizeCardMini.height}
              cardMiniSectionRef={cardMiniSectionRef.current}
            />
          </div>
        )
      case 'envelope':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniEnvelope />
          </div>
        )
      case 'date':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniDate
              valueSection={valueSection}
              heightMinicard={sizeCardMini.height}
            />
          </div>
        )
      case 'aroma':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniAroma
              valueSection={valueSection}
              heightMinicard={sizeCardMini.height}
            />
          </div>
        )
      default:
        break
    }
  }

  return (
    <div
      className={`card-mini-section card-mini-${sectionInfo.section} `}
      style={{
        left: polyCards
          ? `${(sectionInfo.number * sizeCardMini.width) / 10}px`
          : '0',
        padding: sectionInfo.section === 'cardphoto' ? '0' : '0.5rem',
        width: `${sizeCardMini.width}px`,
        height: `${sizeCardMini.height}px`,
        zIndex:
          polyCards && sectionInfo.section === choiceSection.nameSection
            ? // &&
              // sectionClick.source === 'miniCards'
              6
            : sectionInfo.zIndex,
      }}
      onClick={handleClickSection}
      data-name={sectionInfo.section}
      ref={cardMiniSectionRef}
    >
      {renderSection(sectionInfo.section, valueSection)}
      {polyCards ? (
        <></>
      ) : (
        <div className="card-mini-kebab">
          <span className="mini-kebab-dots">
            <span className="mini-kebab-icon"></span>
          </span>
        </div>
      )}
    </div>
  )
}

export default CardMiniSection
