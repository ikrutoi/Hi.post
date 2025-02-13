import { useDispatch } from 'react-redux'
import './BtnCardsNav.scss'
import { addChoiceSection } from '../../../redux/layout/actionCreators'

const BtnCardsNav = ({ handleClick, onMouseEnter, onMouseLeave, section }) => {
  const nameSectionLowerCase = section.name.toLowerCase()
  const dispatch = useDispatch()

  const handleClickBtnNav = () => {
    dispatch(
      addChoiceSection({ source: 'btnNav', nameSection: nameSectionLowerCase })
    )
  }

  return (
    <button
      type="button"
      className="btn-nav"
      onClick={handleClickBtnNav}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-name={nameSectionLowerCase}
    >
      {section.name}
    </button>
  )
}

export default BtnCardsNav
