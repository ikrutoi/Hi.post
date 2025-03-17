import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import './CardsNav.scss'
import BtnCardsNav from './BtnCardNav/BtnCardsNav'
import listNavSections from '../../data/cardsNav/navList.json'
import { colorSchemeNav } from '../../data/nav/colorSchemeNav'

const CardsNav = () => {
  const navBtn = useSelector((state) => state.layout.choiceSection.nameSection)
  const infoNavHistory = useSelector((state) => state.infoButtons.navHistory)
  const btnNavRefs = useRef({})

  const setBtnNavRef = (id) => (element) => {
    btnNavRefs.current[id] = element
  }

  const handleMouseEnterBtn = (evt) => {
    if (
      (evt.target.dataset.section !== 'history' && !infoNavHistory) ||
      evt.target.dataset.section === navBtn
    ) {
      evt.target.style.backgroundColor = 'rgb(220, 220, 220)'
    }
  }

  const handleMouseLeaveBtn = (evt) => {
    if (evt.target.dataset.section !== navBtn)
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
          handleMouseEnterBtn={handleMouseEnterBtn}
          handleMouseLeaveBtn={handleMouseLeaveBtn}
          navBtn={navBtn}
        />
      ))}
    </div>
  )
}

export default CardsNav
