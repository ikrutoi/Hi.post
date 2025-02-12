import { useSelector } from 'react-redux'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import './CardsList.scss'

const CardsList = () => {
  const sectionCardEdit = useSelector((state) => state.cardEdit)
  const sizeMiniCard = useSelector((state) => state.layout.sizeMiniCard)
  const choiceSection = useSelector((state) => state.layout.choiceSection)
  const listSelectedSections = []

  for (let section in sectionCardEdit) {
    if (!!sectionCardEdit[section]) {
      switch (section) {
        case 'cardphoto':
          if (sectionCardEdit[section].url) {
            listSelectedSections.push({ section, number: 0, zIndex: 5 })
          }
          break
        case 'cardtext':
          if (sectionCardEdit[section].text[0].children[0].text) {
            listSelectedSections.push({ section, number: 1, zIndex: 4 })
          }
          break
        case 'envelope':
          if (
            sectionCardEdit[section].toaddress.street !== '' ||
            sectionCardEdit[section].toaddress.index !== '' ||
            sectionCardEdit[section].toaddress.city !== '' ||
            sectionCardEdit[section].toaddress.country !== '' ||
            sectionCardEdit[section].toaddress.name !== ''
          ) {
            listSelectedSections.push({ section, number: 2, zIndex: 3 })
          }
          break
        case 'date':
          if (sectionCardEdit[section]) {
            listSelectedSections.push({ section, number: 3, zIndex: 2 })
          }
          break
        case 'aroma':
          if (sectionCardEdit[section]) {
            listSelectedSections.push({ section, number: 4, zIndex: 1 })
          }
          break
        default:
          break
      }
    }
  }
  const listSortSelectedSections = listSelectedSections.sort(
    (a, b) => a.number - b.number
  )

  const getListPrioritySections = () => {
    const temporaryArray = []
    for (let i = 0; i < listSortSelectedSections.length; i++) {
      if (listSortSelectedSections[i].section !== choiceSection.nameSection) {
        temporaryArray.push(listSortSelectedSections[i])
      } else {
        temporaryArray.unshift(...listSortSelectedSections.slice(i))
        break
      }
    }
    return temporaryArray
  }
  const listPrioritySections = getListPrioritySections()

  return (
    <div className="cards-list">
      <div
        className="mini-poly-cards"
        style={{
          width: `${sizeMiniCard.width + (sizeMiniCard.width * 4) / 10}px`,
          height: `${sizeMiniCard.height}px`,
        }}
      >
        {listPrioritySections.length !== 0 ? (
          listPrioritySections.map((selectedSection, i) => (
            <CardMiniSection
              key={`mini-poly-${selectedSection.section}-${i}`}
              sectionInfo={selectedSection}
              valueSection={sectionCardEdit[selectedSection.section]}
              sizeCardMini={sizeMiniCard}
              polyCards={listPrioritySections}
            />
          ))
        ) : (
          <div
            className="pattern-mini-card"
            style={{
              width: `${sizeMiniCard.width}px`,
              height: `${sizeMiniCard.height}px`,
            }}
          ></div>
        )}
      </div>
      {listSortSelectedSections.length !== 0 ? (
        listSortSelectedSections.map((selectedSection, i) => (
          <CardMiniSection
            key={`card-mini-${selectedSection.section}-${i}`}
            sectionInfo={selectedSection}
            valueSection={sectionCardEdit[selectedSection.section]}
            sizeCardMini={sizeMiniCard}
            polyCards={false}
          />
        ))
      ) : (
        <span></span>
      )}
    </div>
  )
}

export default CardsList
