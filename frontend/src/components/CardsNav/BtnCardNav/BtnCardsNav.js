import { useDispatch, useSelector } from 'react-redux'
import './BtnCardsNav.scss'
import { addChoiceSection } from '../../../redux/layout/actionCreators'
import { infoButtons } from '../../../redux/infoButtons/actionCreators'

const BtnCardsNav = ({
  setBtnNavRef,
  handleMouseEnterContainer,
  handleMouseLeaveContainer,
  section,
}) => {
  const infoEnvelopeClip = useSelector(
    (state) => state.infoButtons.envelopeClip
  )
  const nameNav = section.name.toLowerCase()
  const dispatch = useDispatch()

  const handleClickBtnNav = () => {
    if (nameNav !== 'envelope' && infoEnvelopeClip) {
      dispatch(infoButtons({ envelopeClip: false }))
    }
    dispatch(addChoiceSection({ source: 'btnNav', nameSection: nameNav }))
  }

  return (
    <div
      className="btn-nav-container"
      onMouseEnter={handleMouseEnterContainer}
      onMouseLeave={handleMouseLeaveContainer}
    >
      <button
        ref={setBtnNavRef(`nav-${nameNav}`)}
        type="button"
        className={`btn-nav btn-nav-${nameNav}`}
        onClick={handleClickBtnNav}
        data-name={nameNav}
      >
        {section.name}
      </button>
    </div>
  )
}

export default BtnCardsNav
