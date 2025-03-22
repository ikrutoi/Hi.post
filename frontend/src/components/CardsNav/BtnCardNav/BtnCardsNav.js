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
  const infoButtonsRedux = useSelector((state) => state.infoButtons)
  const nameNav = section.name.toLowerCase()
  const dispatch = useDispatch()

  const handleClickBtn = (evt) => {
    const btnNav = evt.target.dataset.section
    if (btnNav !== 'envelope' && infoButtonsRedux.envelopeClip) {
      dispatch(infoButtons({ envelopeClip: false }))
    }
    if (btnNav !== 'cardtext' && infoButtonsRedux.cardtext.clip === 'hover') {
      dispatch(
        infoButtons({
          cardtext: {
            ...infoButtonsRedux.cardtext,
            clip: true,
          },
        })
      )
    }
    dispatch(addChoiceSection({ source: 'btnNav', nameSection: btnNav }))
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
