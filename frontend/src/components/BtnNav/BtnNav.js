import './BtnNav.scss'

const BtnNav = ({ nameNav, onClick, onMouseEnter, onMouseLeave }) => {
  return (
    <button
      type="button"
      className="btn-nav"
      onClick={() => onClick(nameNav)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-name={nameNav.toLowerCase()}
    >
      {nameNav}
    </button>
  )
}

export default BtnNav
