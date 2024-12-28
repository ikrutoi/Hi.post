import './CardMiniSection.scss'
import sizeCardMini from '../../../data/ratioCardCardMini.json'

const CardMiniSection = ({ hover, dimensionHeight }) => {
  const heightCardMini = dimensionHeight * sizeCardMini.cardmini
  const widthCardMini = heightCardMini * 1.42

  return (
    <div
      className="card-mini-section"
      style={{ width: `${widthCardMini}px`, height: `${heightCardMini}px` }}
    ></div>
  )
}

export default CardMiniSection
