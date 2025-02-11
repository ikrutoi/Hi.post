import { useEffect, useRef, useState } from 'react'
import './CardMiniSection.scss'
import MiniCardtext from './MiniCardtext/MiniCardtext'
import MiniEnvelope from './MiniEnvelope/MiniEnvelope'
import MiniDate from './MiniDate/MiniDate'
import MiniAroma from './MiniAroma/MiniAroma'
import MiniPhoto from './MiniPhoto/MiniPhoto'

const CardMiniSection = ({
  valueSection,
  sizeCardMini,
  handleClick,
  polyCards,
  index,
  sectionInfo,
  hover,
  sectionClick,
}) => {
  const cardMiniSectionRef = useRef(null)

  // const [upSectionFromPolyCards, setUpSectionFromPolyCards] = useState(null)

  // useEffect(() => {
  //   if (polyCards && sectionInfo.section === sectionClick) {
  //     setUpSectionFromPolyCards(hover.toLowerCase())
  //   }
  // })

  const handleClickSection = (evt) => {
    const parentName = evt.target.closest('.card-mini-section').dataset.name
    handleClick({
      name: parentName.charAt(0).toUpperCase() + parentName.slice(1),
      source: 'miniCards',
    })
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
      className={`card-mini-section card-mini-${sectionInfo.section} ${
        polyCards ? 'poly' : ''
      } ${
        polyCards && sectionInfo.section === hover.toLowerCase() ? 'hover' : ''
      }`}
      style={{
        left: polyCards ? `${(index * sizeCardMini.width) / 10}px` : '0',
        padding: sectionInfo.section === 'cardphoto' ? '0' : '0.5rem',
        width: `${sizeCardMini.width}px`,
        height: `${sizeCardMini.height}px`,
        zIndex:
          polyCards &&
          sectionInfo.section === sectionClick.name.toLowerCase() &&
          sectionClick.source === 'miniCards'
            ? 6
            : sectionInfo.zIndex,
      }}
      onClick={handleClickSection}
      data-name={sectionInfo.section}
      ref={cardMiniSectionRef}
    >
      {renderSection(sectionInfo.section, valueSection)}
      <div className="card-mini-kebab">
        <span className="mini-kebab-dots">
          <span className="mini-kebab-icon"></span>
        </span>
      </div>
    </div>
  )
}

export default CardMiniSection
