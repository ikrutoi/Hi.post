import './CardsNav.scss'
import BtnCardsNav from './BtnCardNav/BtnCardsNav'
import listNavSections from '../../data/cardsNav/navList.json'

const CardsNav = ({ handleClick }) => {
  const handleMouseEnter = (e) => {
    const navSection = listNavSections.find(
      (el) => el.name === e.target.textContent
    )
    if (navSection) {
      e.target.style.backgroundColor = navSection.colorRGBA
    }
    // dispatch(addBtnNavHover(e.target.textContent.toLowerCase()))
  }

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = ''
    // e.target.classList.remove('hover')
    // setSectionHover('')
    // dispatch(addBtnNavHover(null))
  }

  return (
    <div className="cards-nav">
      {listNavSections.map((section, i) => (
        <BtnCardsNav
          section={section}
          key={i}
          // handleClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  )
}

export default CardsNav
