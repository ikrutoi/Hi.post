import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import './Toolbar.scss'
import listNavBtns from '../../../../../data/cardtext/list-textarea-nav-btns.json'
import Tooltip from './Tooltip/Tooltip'

const Toolbar = () => {
  const selector = useSelector((state) => state.cardEdit.cardtext)
  const inputCardtext = selector.text
    ? selector
    : {
        text: { row1: 'hello...' },
        maxchars: 300,
        color: 'blue1',
        fontsize: 3,
        lines: 1,
        focus: false,
        focusrow: 1,
      }
  const [cardtext, setCardtext] = useState(inputCardtext)
  const [tooltip, setTooltip] = useState(null)

  const handleMouseOver = (evt) => {
    const toolbarElement = document.querySelector('.toolbar')
    const toolbarBtnElement = document.querySelectorAll('.toolbar-btn')[0]
    const widthToolbarBtn = toolbarBtnElement.getBoundingClientRect().width
    const leftToolbar = toolbarElement.getBoundingClientRect().left
    // const deltaWidth =
    const target = evt.target
    const coords = target.getBoundingClientRect()
    const left = coords.left - leftToolbar
    const tooltipBtn = target.dataset.tooltip
    if (!tooltipBtn) {
      return
    }
    const widthBtnTooltip = tooltipBtn
    // console.log('btn', target.getBoundingClientRect().width)
    setTooltip({
      text: tooltipBtn,
      targetelement: target,
      left: `${left}`,
      widthbtn: widthToolbarBtn,
      // top: `50px`,
      // top: `${top}px`,
    })
  }

  const handleMouseOut = () => {
    setTooltip(null)
  }

  return (
    <div className="toolbar">
      <div className="toolbar-settings">
        {listNavBtns.map((btn, i) => (
          <span
            className={`toolbar-btn toolbar--${btn}`}
            data-tooltip={btn}
            key={i}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          ></span>
        ))}
        {tooltip && <Tooltip tooltip={tooltip} />}
      </div>
      {/* <div className="toolbar-chars">
        <span className="toolbar-btn toolbar-btn-chars toolbar-enteredchars">
          {cardtext.text.length}
        </span>
        <span className="toolbar-btn">/</span>
        <span className="toolbar-btn toolbar-btn-chars toolbar-maxchars">
          {cardtext.maxchars}
        </span>
      </div> */}
    </div>
  )
}

export default Toolbar
