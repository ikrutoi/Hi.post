import { useDispatch } from 'react-redux'
import './BtnCardsNav.scss'
import { addChoiceSection } from '../../../redux/layout/actionCreators'
import { useRef } from 'react'

const BtnCardsNav = ({
  handleMouseEnterContainer,
  handleMouseLeaveContainer,
  section,
}) => {
  const btnNavRef = useRef()
  const nameSectionLowerCase = section.name.toLowerCase()
  const dispatch = useDispatch()

  const handleClickBtnNav = () => {
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
