import './CardMiniSection.scss'
import scaleSizeCardMini from '../../../data/ratioCardCardMini.json'
import MiniCardtext from './MiniCardtext/MiniCardtext'
import MiniEnvelope from './MiniEnvelope/MiniEnvelope'
import MiniDate from './MiniDate/MiniDate'
import MiniAroma from './MiniAroma/MiniAroma'
import { useRef } from 'react'
import MiniPhoto from './MiniPhoto/MiniPhoto'

const CardMiniSection = ({
  section,
  valueSection,
  dimensionHeight,
  handleClick,
  heightMinicard,
}) => {
  const sizeCardMini = {
    height: dimensionHeight * scaleSizeCardMini.cardmini,
    width: dimensionHeight * scaleSizeCardMini.cardmini * 1.42,
  }

  const cardMiniSectionRef = useRef(null)

  const handleClickSection = (evt) => {
    const parentName = evt.target.closest('.card-mini-section').dataset.name
    handleClick(parentName.charAt(0).toUpperCase() + parentName.slice(1))
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
      style={{
        padding: section === 'cardphoto' ? '0' : '0.5rem',
        width: `${sizeCardMini.width}px`,
        height: `${sizeCardMini.height}px`,
      }}
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
