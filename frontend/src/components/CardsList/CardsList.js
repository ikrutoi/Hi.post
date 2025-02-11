import { useState } from 'react'
import { useSelector } from 'react-redux'
// import CardMiniPuzzle from './CardMiniPuzzle/CardMiniPuzzle'
import CardMiniSection from './CardMiniSections/CardMiniSection'
import './CardsList.scss'
// import MiniPolyCards from './CardMiniSections/MiniPolyCards/MiniPolyCards'
import scaleSizeCardMini from '../../data/ratioCardCardMini.json'

const CardsList = ({
  name,
  hover,
  dimensionHeight,
  dimensionWidth,
  handleClick,
}) => {
  const sectionCardEdit = useSelector((state) => state.cardEdit)

  const sizeCardMini = {
    height: Number((dimensionHeight * scaleSizeCardMini.cardmini).toFixed(2)),
    width: Number(
      (dimensionHeight * scaleSizeCardMini.cardmini * 1.42).toFixed(2)
    ),
  }

  // const cardMiniPuzzleRef = useRef(null)

  const listSelectedSections = []
  for (let section in sectionCardEdit) {
    if (!!sectionCardEdit[section]) {
      switch (section) {
        case 'cardphoto':
          if (sectionCardEdit[section].url) {
            listSelectedSections.push({ section, number: 1, zIndex: 5 })
            // listSelectedSections.push(`1-${section}`)
          }
          break
        case 'cardtext':
          if (sectionCardEdit[section].text[0].children[0].text) {
            listSelectedSections.push({ section, number: 2, zIndex: 4 })
            // listSelectedSections.push(`2-${section}`)
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
            listSelectedSections.push({ section, number: 3, zIndex: 3 })
            // listSelectedSections.push(`3-${section}`)
          }
          break
        case 'date':
          if (sectionCardEdit[section]) {
            listSelectedSections.push({ section, number: 4, zIndex: 2 })
            // listSelectedSections.push(`4-${section}`)
          }
          break
        case 'aroma':
          if (sectionCardEdit[section]) {
            listSelectedSections.push({ section, number: 5, zIndex: 1 })
            // listSelectedSections.push(`5-${section}`)
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

  return (
    <div className="cards-list">
      {/* <CardMiniPuzzle
        // ref={cardMiniPuzzleRef}
        hover={hover}
        listSelectedSections={listSelectedSections}
        sizeCardMini={sizeCardMini}
        calcHeightMinicard={setHeightMinicard}
      /> */}
      <div
        className="mini-poly-cards"
        style={{
          width: `${sizeCardMini.width + (sizeCardMini.width * 4) / 10}px`,
          height: `${sizeCardMini.height}px`,
        }}
      >
        {listSortSelectedSections.length !== 0 ? (
          listSortSelectedSections.map((selectedSection, i) => (
            <CardMiniSection
              key={`mini-poly-${selectedSection.section}-${i}`}
              sectionInfo={selectedSection}
              valueSection={sectionCardEdit[selectedSection.section]}
              sizeCardMini={sizeCardMini}
              handleClick={handleClick}
              index={i}
              polyCards={true}
              hover={hover}
              sectionClick={name}
            />
          ))
        ) : (
          <div
            className="pattern-mini-card"
            style={{
              width: `${sizeCardMini.width}px`,
              height: `${sizeCardMini.height}px`,
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
            sizeCardMini={sizeCardMini}
            handleClick={handleClick}
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
