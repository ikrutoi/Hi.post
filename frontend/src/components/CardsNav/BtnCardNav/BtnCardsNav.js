import './BtnCardsNav.scss'

const BtnCardsNav = ({ nameNav, handleClick, onMouseEnter, onMouseLeave }) => {
  return (
    <button
      type="button"
      className="btn-nav"
      onClick={() => handleClick(nameNav)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-name={nameNav.toLowerCase()}
    >
      {nameNav}
    </button>
  )
}

export default BtnCardsNav
