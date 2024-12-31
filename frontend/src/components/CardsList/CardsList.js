// import { useSelector } from 'react-redux'
import { useSelector } from 'react-redux'
import CardMiniPuzzle from './CardMiniPuzzle/CardMiniPuzzle'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import './CardsList.scss'

const CardsList = ({ name, hover, dimensionHeight, dimensionWidth }) => {
  const sections = useSelector((state) => state.cardSections)
  const selectedSectors = sections.map((section) => section.section)
  return (
    <div className="cards-list">
      <CardMiniPuzzle
        hover={hover}
        selectedSectors={selectedSectors}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
      />
      {sections.length !== 0 ? (
        sections.map((section, i) => (
          <CardMiniSection
            key={i}
            section={section}
            dimensionHeight={dimensionHeight}
            dimensionWidth={dimensionWidth}
          />
        ))
      ) : (
        <span></span>
      )}
    </div>
  )
}

export default CardsList
