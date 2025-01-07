import { useSelector } from 'react-redux'
import CardMiniPuzzle from './CardMiniPuzzle/CardMiniPuzzle'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import './CardsList.scss'

const CardsList = ({ name, hover, dimensionHeight, dimensionWidth }) => {
  const sections = useSelector((state) => state.cardEdit)
  const listSelectedSections = []
  for (let section in sections) {
    if (!!sections[section]) {
      listSelectedSections.push(section)
    }
  }

  return (
    <div className="cards-list">
      <CardMiniPuzzle
        hover={hover}
        listSelectedSections={listSelectedSections}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
      />
      {listSelectedSections.length !== 0 ? (
        listSelectedSections.map((selectedSection, i) => (
          <CardMiniSection
            key={`${selectedSection}-${i}`}
            section={selectedSection}
            valueSection={sections[selectedSection]}
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
