import './CardMiniSection.scss'
import sizeCardMini from '../../../data/ratioCardCardMini.json'
import MiniCardtext from './MiniCardtext/MiniCardtext'
import MiniEnvelope from './MiniEnvelope/MiniEnvelope'
import MiniDate from './MiniDate/MiniDate'
import MiniAroma from './MiniAroma/MiniAroma'
import { useRef } from 'react'

const CardMiniSection = ({
  section,
  valueSection,
  dimensionHeight,
  handleClick,
  heightMinicard,
  // cardminiRef,
}) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  const cardMiniSectionRef = useRef(null)

  const handleClickSection = (evt) => {
    const parentName = evt.target.closest('.card-mini-section').dataset.name
    handleClick(parentName.charAt(0).toUpperCase() + parentName.slice(1))
  }

  const renderSection = (section, valueSection) => {
    switch (section) {
      case 'cardphoto':
        return (
          <div className={`mini-section-value mini-section-${section}`}></div>
        )
      case 'cardtext':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniCardtext
              heightMinicard={heightMinicard}
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
              heightMinicard={heightMinicard}
            />
          </div>
        )
      case 'aroma':
        return (
          <div className={`mini-section-value mini-section-${section}`}>
            <MiniAroma
              valueSection={valueSection}
              heightMinicard={heightMinicard}
            />
          </div>
        )
      default:
        break
    }
  }

  return (
    <div
      className={`card-mini-section card-mini-${section}`}
      style={{ width: `${widthCardMini}px`, height: `${heightCardMini}px` }}
      onClick={handleClickSection}
      data-name={section}
      ref={cardMiniSectionRef}
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
