// import { useRef } from 'react'
// import { useDispatch } from 'react-redux'
import './CardFormNavCardtext.scss'
import ToolbarCardtext from './ToolbarCardtext/ToolbarCardtext'
// import { addCardtext } from '../../../../redux/cardEdit/actionCreators'

const CardFormNavCardtext = ({
  handleClickBtnNav,
  setToolbarColorActive,
  // handleClickColor,
  toolbarColor,
}) => {
  // const btnRefs = useRef([])

  // const dispatch = useDispatch()

  // const handleClickToolbar = (evt, i) => {
  //   // console.log('btnRef', btnRefs.current[i])
  //   const searchParentBtn = (el) => {
  //     if (el.classList.contains('toolbar-btn')) {
  //       return el
  //     } else if (el.parentElement) {
  //       return searchParentBtn(el.parentElement)
  //     }
  //     return null
  //   }

  //   const btn = searchParentBtn(evt.target)
  //   const btnTooltip = btn.dataset.tooltip

  //   if (btnTooltip === 'color') {
  //     setToolbarColorActive(true)
  //   }
  //   if (
  //     btnTooltip === 'left' ||
  //     btnTooltip === 'center' ||
  //     btnTooltip === 'right' ||
  //     btnTooltip === 'justify'
  //   ) {
  //     dispatch(addCardtext({ textAlign: btn.dataset.tooltip }))
  //   }
  // }

  // const handleClickColor = (evt) => {
  //   dispatch(
  //     addCardtext({
  //       colorName: evt.target.dataset.colorName,
  //       colorType: evt.target.dataset.colorType,
  //     })
  //   )
  // }
  return (
    <div className="cardformnav-cardtext">
      <ToolbarCardtext
        handleClickBtnNav={handleClickBtnNav}
        setToolbarColorActive={setToolbarColorActive}
        // btnRefs={btnRefs}
        // handleClickToolbar={handleClickToolbar}
        // cardtext={cardtext}
        toolbarColor={toolbarColor}
        // toolbarIconColor={cardtext.colorType}
        // handleClickColor={handleClickColor}
      />
    </div>
  )
}

export default CardFormNavCardtext
