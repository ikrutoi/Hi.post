import BtnCardNav from '../BtnCardNav/BtnCardNav'
import './CardNav.css'

const CardNav = ({ name }) => {
  return (
    <d className="card-nav">
      {name}
      <BtnCardNav />
    </d>
  )
}

export default CardNav
