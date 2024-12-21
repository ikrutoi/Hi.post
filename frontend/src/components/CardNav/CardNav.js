import BtnCardNav from './BtnCardNav/BtnCardNav'
import './CardNav.scss'

const CardNav = ({ name }) => {
  return (
    <d className="card-nav">
      {name}
      <BtnCardNav />
    </d>
  )
}

export default CardNav
