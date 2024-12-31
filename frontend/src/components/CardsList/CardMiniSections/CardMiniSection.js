import './CardMiniSection.scss'
import sizeCardMini from '../../../data/ratioCardCardMini.json'

const CardMiniSection = ({ section, dimensionHeight }) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  const renderSection = (section) => {
    switch (section.section) {
      case 'aroma':
        return (
          <>
            <span>{section.make}</span>
            <span>{section.name}</span>
          </>
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
      {renderSection(section)}
    </div>
  )
}

export default CardMiniSection
