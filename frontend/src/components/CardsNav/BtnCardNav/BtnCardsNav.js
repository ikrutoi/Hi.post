import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import './BtnCardsNav.scss'
import { addChoiceSection } from '../../../redux/layout/actionCreators'
import { infoButtons } from '../../../redux/infoButtons/actionCreators'

const BtnCardsNav = ({
  handleMouseEnterContainer,
  handleMouseLeaveContainer,
  section,
}) => {
  const infoEnvelopeClip = useSelector(
    (state) => state.infoButtons.envelopeClip
  )
  const btnNavRef = useRef()
  const nameSectionLowerCase = section.name.toLowerCase()
  const dispatch = useDispatch()

  const handleClickBtnNav = () => {
    if (nameSectionLowerCase !== 'envelope' && infoEnvelopeClip) {
      dispatch(infoButtons({ envelopeClip: false }))
    }
    dispatch(
      addChoiceSection({ source: 'btnNav', nameSection: nameSectionLowerCase })
    )
  }

  return (
    <div
      className="btn-nav-container"
      onMouseEnter={() =>
        handleMouseEnterContainer(btnNavRef.current, section.colorHoverRGBA)
      }
      onMouseLeave={() =>
        handleMouseLeaveContainer(btnNavRef.current, section.colorRGBA)
      }
    >
      <button
        ref={btnNavRef}
        type="button"
        className="btn-nav"
        onClick={handleClickBtnNav}
        data-name={nameSectionLowerCase}
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
