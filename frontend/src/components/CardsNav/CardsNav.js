import './CardsNav.scss'
import BtnCardsNav from './BtnCardNav/BtnCardsNav'
import listNavSections from '../../data/cardsNav/navList.json'

const CardsNav = () => {
  const handleMouseEnterContainer = (el, colorHover) => {
    el.style.backgroundColor = colorHover
    // el.style.borderBottomStyle = 'solid'
    // el.style.borderBottomColor = color
  }

  const handleMouseLeaveContainer = (el, color) => {
    el.style.backgroundColor = color
    // el.style.border = 'solid 1px rgb(255, 255, 255)'
    // el.style.borderBottomStyle = 'solid'
    // el.style.borderBottomColor = 'rgb(255, 255, 255)'
  }

  return (
    <div className="cards-nav">
      {listNavSections.map((section, i) => (
        <BtnCardsNav
          section={section}
          key={i}
          handleMouseEnterContainer={handleMouseEnterContainer}
          handleMouseLeaveContainer={handleMouseLeaveContainer}
        />
      ))}
    </div>
  )
}

export default CardsNav
