import './CardsNav.scss'
import BtnCardsNav from './BtnCardNav/BtnCardsNav'
import listNavSections from '../../data/cardsNav/navList.json'

const CardsNav = () => {
  const handleMouseEnterContainer = (el, color) => {
    el.style.borderBottomWidth = '1px'
    el.style.borderBottomStyle = 'solid'
    el.style.borderBottomColor = color
  }

  const handleMouseLeaveContainer = (el) => {
    el.style.borderBottomWidth = '1px'
    el.style.borderBottomStyle = 'solid'
    el.style.borderBottomColor = 'rgb(255, 255, 255)'
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
