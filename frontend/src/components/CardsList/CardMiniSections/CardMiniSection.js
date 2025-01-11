import './CardMiniSection.scss'
import sizeCardMini from '../../../data/ratioCardCardMini.json'
import listOfMonthOfYear from '../../../data/date/monthOfYear.json'

const CardMiniSection = ({ section, valueSection, dimensionHeight }) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  const renderSection = (section, valueSection) => {
    switch (section) {
      case 'cardphoto':
        return <span className="mini-section-value"></span>
      case 'cardtext':
        return <span className="mini-section-value"></span>
      case 'envelope':
        return (
          <span className="mini-section-value">
            <span className="mini-envelope"></span>
            {/* <img
              className="mini-envelope"
              src="../../../data/envelope-mini-notactive.png"
              alt="Description"
            /> */}
          </span>
        )
      case 'date':
        return (
          <span className="mini-section-value">
            <span>{valueSection.year}</span>
            <span>{listOfMonthOfYear[valueSection.month]}</span>
            <span>{valueSection.day}</span>
          </span>
        )
      case 'aroma':
        return (
          <span className="mini-section-value">
            <span>{valueSection.make}</span>
            <span>{valueSection.name}</span>
          </span>
        )
      default:
        break
    }
  }

  return (
    <div
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
