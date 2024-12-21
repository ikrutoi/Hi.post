import './BtnNav.scss'

const BtnNav = ({ nameNav, onClick }) => {
  return (
    <button type="button" className="btn-nav" onClick={() => onClick(nameNav)}>
      {nameNav}
    </button>
  )
}

export default BtnNav
