import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import './CardsNav.scss'
import BtnCardsNav from './BtnCardNav/BtnCardsNav'
import listNavSections from '../../data/cardsNav/navList.json'
import { colorSchemeNav } from '../../data/nav/colorSchemeNav'

const CardsNav = () => {
  const infoNavHistory = useSelector((state) => state.infoButtons.navHistory)
  const btnNavRefs = useRef({})

  const setBtnNavRef = (id) => (element) => {
    btnNavRefs.current[id] = element
  }

  const handleMouseEnterContainer = (evt) => {
    if (evt.target.dataset.name !== 'history' && !infoNavHistory) {
      evt.target.style.backgroundColor = 'rgb(220, 220, 220)'
    }
  }

  const handleMouseLeaveContainer = (evt) => {
    evt.target.style.backgroundColor = 'rgb(240, 240, 240)'
  }

  useEffect(() => {
    btnNavRefs.current['nav-history'].style.color =
      colorSchemeNav[infoNavHistory]
    btnNavRefs.current['nav-history'].style.cursor = infoNavHistory
      ? 'cursor'
      : 'default'
  }, [infoNavHistory])

  return (
    <div className="cards-nav">
      {listNavSections.map((section, i) => (
        <BtnCardsNav
          key={`${section}-${i}`}
          btnNavRefs={btnNavRefs}
          setBtnNavRef={setBtnNavRef}
          section={section}
          handleMouseEnterContainer={handleMouseEnterContainer}
          handleMouseLeaveContainer={handleMouseLeaveContainer}
        />
      ))}
    </div>
  )
}

export default CardsNav
