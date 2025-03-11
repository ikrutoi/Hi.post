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

  const handleMouseEnterContainer = (el, colorHover) => {
    if (el.dataset.name !== 'history' && !infoNavHistory) {
      el.style.backgroundColor = colorHover
    }
  }

  const handleMouseLeaveContainer = (el, color) => {
    el.style.backgroundColor = color
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
          btnNavRefs={btnNavRefs}
          setBtnNavRef={setBtnNavRef}
          section={section}
          key={`${section}-${i}`}
          handleMouseEnterContainer={handleMouseEnterContainer}
          handleMouseLeaveContainer={handleMouseLeaveContainer}
        />
      ))}
    </div>
  )
}

export default CardsNav
