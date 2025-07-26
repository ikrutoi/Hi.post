// import { useRef } from 'react'
import React from 'react'
import { useSelector } from 'react-redux'
import './CardFormNav.scss'
// import Toolbar from './Toolbar/Toolbar'
// import ToolbarDate from './Toolbar/ToolbarDate/ToolbarDate'
// import { addBtnToolbar } from '../../../redux/layout/actionCreators'

const CardFormNav = () => {
  // const sectionDate = useSelector((state) => state.cardEdit.date)
  // const layoutChoiceSection = useSelector((state) => state.layout.choiceSection)
  const sizeCard = useSelector((state) => state.layout.sizeCard)
  // const dispatch = useDispatch()

  // const handleClickBtnToolbar = (evt) => {
  //   const btn = evt.target.closest('.toolbar-btn')
  //   dispatch(
  //     addBtnToolbar({
  //       firstBtn: btn.dataset.tooltip,
  //       section: btn.dataset.section,
  //       secondBtn: btn.dataset.additional ? btn.dataset.additional : null,
  //     })
  //   )
  // }

  // const cardFormNavRef = useRef(null)

  // const section = (name) => {
  //   if (name === 'date') {
  //     return <ToolbarDate choice={sectionDate ? true : false} />
  //   }
  //   // return (
  //   //   <Toolbar
  //   //     nameSection={name}
  //   //     handleClickBtnToolbar={handleClickBtnToolbar}
  //   //   />
  //   // )
  // }

  return (
    <div
      // ref={cardFormNavRef}
      className="card-form-nav"
      style={{ width: `${sizeCard.width}px` }}
    >
      {/* {section(layoutChoiceSection.nameSection)} */}
    </div>
  )
}

export default CardFormNav
