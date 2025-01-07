import './CardMiniSection.scss'
import sizeCardMini from '../../../data/ratioCardCardMini.json'
import listOfMonthOfYear from '../../../data/date/monthOfYear.json'

const CardMiniSection = ({ section, valueSection, dimensionHeight }) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  const renderSection = (section, valueSection) => {
    switch (section) {
      case 'aroma':
        return (
          <span className="mini-section-value">
            <span>{valueSection.make}</span>
            <span>{valueSection.name}</span>
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
      default:
        break
    }
  }

  return (
    <div
      className="card-mini-section"
      style={{ width: `${widthCardMini}px`, height: `${heightCardMini}px` }}
    >
      <span className="mini-section-title">{section}</span>
      {renderSection(section, valueSection)}
    </div>
  )
}

export default CardMiniSection
