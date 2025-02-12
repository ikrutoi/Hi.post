import { useDispatch } from 'react-redux'
import './BtnCardsNav.scss'
import { addChoiceSection } from '../../../redux/layout/actionCreators'

const BtnCardsNav = ({ nameNav, handleClick, onMouseEnter, onMouseLeave }) => {
  const nameSectionLowerCase = nameNav.toLowerCase()
  const dispatch = useDispatch()

  const handleClickBtnNav = () => {
    // handleClick({ source: 'cardsNav', name: nameSectionLowerCase })
    dispatch(
      addChoiceSection({ source: 'btnNav', nameSection: nameSectionLowerCase })
    )
  }

  return (
    <button
      type="button"
      className="btn-nav"
      onClick={handleClickBtnNav}
      // onMouseEnter={onMouseEnter}
      // onMouseLeave={onMouseLeave}
      data-name={nameSectionLowerCase}
    >
      {nameNav}
    </button>
  )
}

export default BtnCardsNav
