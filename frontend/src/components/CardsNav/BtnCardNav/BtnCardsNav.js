import { useDispatch, useSelector } from 'react-redux'
import './BtnCardsNav.scss'
import { addChoiceSection } from '../../../redux/layout/actionCreators'
import { infoButtons } from '../../../redux/infoButtons/actionCreators'

const BtnCardsNav = ({
  setBtnNavRef,
  handleMouseEnterBtn,
  handleMouseLeaveBtn,
  section,
  navBtn,
}) => {
  const infoEnvelopeClip = useSelector(
    (state) => state.infoButtons.envelopeClip
  )
  const nameNav = section.name.toLowerCase()
  const dispatch = useDispatch()

  const handleClickBtn = () => {
    if (nameNav !== 'envelope' && infoEnvelopeClip) {
      dispatch(infoButtons({ envelopeClip: false }))
    }
    dispatch(addChoiceSection({ source: 'btnNav', nameSection: nameNav }))
  }

  return (
    <button
      ref={setBtnNavRef(`nav-${nameNav}`)}
      type="button"
      className={`btn-nav btn-nav-${nameNav}`}
      onClick={handleClickBtn}
      data-section={nameNav}
      style={{
        backgroundColor:
          navBtn === nameNav ? 'rgb(220, 220, 220)' : 'rgb(240, 240, 240)',
      }}
      onMouseEnter={handleMouseEnterBtn}
      onMouseLeave={handleMouseLeaveBtn}
    >
      {section.name}
    </button>
  )
}

export default BtnCardsNav
