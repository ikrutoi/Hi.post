import './CardMiniSection.scss'
import sizeCardMini from '../../../data/ratioCardCardMini.json'
import listOfMonthOfYear from '../../../data/date/monthOfYear.json'
import MiniCardtext from './MiniCardtext/MiniCardtext'
import MiniEnvelope from './MiniEnvelope/MiniEnvelope'
import { useRef } from 'react'

const CardMiniSection = ({ section, valueSection, dimensionHeight }) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42
  const cardminiRef = useRef(null)

  const renderSection = (section, valueSection) => {
    switch (section) {
      case 'cardphoto':
        return (
          <div className={`mini-section-value mini-section-${section}`}></div>
        )
      case 'cardtext':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniCardtext cardminiRef={cardminiRef.current} />
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
            <span>{valueSection.year}</span>
            <span>{listOfMonthOfYear[valueSection.month]}</span>
            <span>{valueSection.day}</span>
          </div>
        )
      case 'aroma':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <span>{valueSection.make}</span>
            <span>{valueSection.name}</span>
          </div>
        )
      default:
        break
    }
  }

  return (
    <div
      ref={cardminiRef}
      className={`card-mini-section card-mini-${section}`}
      style={{ width: `${widthCardMini}px`, height: `${heightCardMini}px` }}
    >
      {renderSection(section, valueSection)}
      <div className="card-mini-kebab">
        <span className="mini-kebab-dots">
          <span className="mini-kebab-icon"></span>
        </span>
      </div>
    </div>
  )
}

export default CardMiniSection
