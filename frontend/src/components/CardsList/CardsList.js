import { useSelector } from 'react-redux'
import CardMiniPuzzle from './CardMiniPuzzle/CardMiniPuzzle'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import './CardsList.scss'

const CardsList = ({ name, hover, dimensionHeight, dimensionWidth }) => {
  const sections = useSelector((state) => state.cardEdit)
  const listSelectedSections = []
  for (let section in sections) {
    if (!!sections[section]) {
      switch (section) {
        case 'cardphoto':
          listSelectedSections.push(`1-${section}`)
          break
        case 'cardtext':
          listSelectedSections.push(`2-${section}`)
          break
        case 'envelope':
          if (
            sections[section].toaddress &&
            sections[section].toaddress.street !== '' &&
            sections[section].toaddress.index !== '' &&
            sections[section].toaddress.city !== '' &&
            sections[section].toaddress.country !== '' &&
            sections[section].toaddress.name !== ''
          ) {
            listSelectedSections.push(`3-${section}`)
          }
          break
        case 'date':
          if (sections[section]) {
            listSelectedSections.push(`4-${section}`)
          }
          break
        case 'aroma':
          if (sections[section]) {
            listSelectedSections.push(`5-${section}`)
          }
          break
        default:
          break
      }
    }
  }
  const listSortSelectedSections = listSelectedSections.sort()

  return (
    <div className="cards-list">
      <CardMiniPuzzle
        hover={hover}
        listSelectedSections={listSelectedSections}
        dimensionHeight={dimensionHeight}
        dimensionWidth={dimensionWidth}
      />
      {listSortSelectedSections.length !== 0 ? (
        listSortSelectedSections.map((selectedSection, i) => (
          <CardMiniSection
            key={`${selectedSection.split('-')[1]}-${i}`}
            section={selectedSection.split('-')[1]}
            valueSection={sections[selectedSection.split('-')[1]]}
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
