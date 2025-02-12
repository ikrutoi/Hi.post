import BtnCardsNav from './BtnCardNav/BtnCardsNav'
import navList from '../../data/navList.json'
import './CardsNav.scss'

const CardsNav = ({ handleClick, handleMouseEnter, handleMouseLeave }) => {
  return (
    <div className="cards-nav">
      {navList.map((name, i) => (
        <BtnCardsNav
          nameNav={name}
          key={i}
          // handleClick={handleClick}
          // onMouseEnter={handleMouseEnter}
          // onMouseLeave={handleMouseLeave}
          // dataName
        />
      ))}
    </div>
  )
}

export default CardsNav
