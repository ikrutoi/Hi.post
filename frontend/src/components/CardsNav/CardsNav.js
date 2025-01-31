import BtnCardsNav from './BtnCardNav/BtnCardsNav'
import navList from '../../data/navList.json'
import './CardsNav.scss'

const CardsNav = ({ handleClick, onMouseEnter, onMouseLeave }) => {
  return (
    <div className="cards-nav">
      {navList.map((name, i) => (
        <BtnCardsNav
          nameNav={name}
          key={i}
          handleClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          dataName
        />
      ))}
    </div>
  )
}

export default CardsNav
