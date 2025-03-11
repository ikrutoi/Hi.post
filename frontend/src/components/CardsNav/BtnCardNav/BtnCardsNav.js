import { useDispatch, useSelector } from 'react-redux'
import './BtnCardsNav.scss'
import { addChoiceSection } from '../../../redux/layout/actionCreators'
import { infoButtons } from '../../../redux/infoButtons/actionCreators'

const BtnCardsNav = ({
  btnNavRefs,
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
      onMouseEnter={() =>
        handleMouseEnterContainer(
          btnNavRefs.current[`nav-${nameNav}`],
          section.colorHoverRGBA
        )
      }
      onMouseLeave={() =>
        handleMouseLeaveContainer(
          btnNavRefs.current[`nav-${nameNav}`],
          section.colorRGBA
        )
      }
    >
      <button
        ref={setBtnNavRef(`nav-${nameNav}`)}
        type="button"
        className={`btn-nav btn-nav-${nameNav}`}
        onClick={handleClickBtnNav}
        data-name={nameNav}
        style={{
          backgroundColor: section.colorRGBA,
        }}
      >
        {section.name}
      </button>
    </div>
  )
}

export default BtnCardsNav
