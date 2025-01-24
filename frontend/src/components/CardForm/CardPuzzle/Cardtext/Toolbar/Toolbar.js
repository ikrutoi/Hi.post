import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from 'react-icons/fa'
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
  const [clickBtnToolbar, setClickBtnToolbar] = useState(null)

  const handleOnClick = (evt) => {
    let btn
    if (evt.target.tagName === 'svg' || evt.target.tagName === 'path') {
      if (evt.target.tagName === 'svg') {
        btn = evt.target.parentElement
      }
      if (evt.target.tagName === 'path') {
        btn = evt.target.parentElement.parentElement
      }
    } else {
      btn = evt.target
    }
    setClickBtnToolbar(btn.dataset.tooltip)
  }

  useEffect(() => {
    console.log('click:', clickBtnToolbar)
  }, [clickBtnToolbar])

  const handleMouseEnter = (evt) => {
    const toolbarElement = document.querySelector('.toolbar')
    const toolbarBtnElement = document.querySelectorAll('.toolbar-btn')[0]
    const widthToolbarBtn = toolbarBtnElement.getBoundingClientRect().width
    const leftToolbar = toolbarElement.getBoundingClientRect().left
    const target = evt.target
    const coords = target.getBoundingClientRect()
    const left = coords.left - leftToolbar
    const tooltipBtn = target.dataset.tooltip
    if (!tooltipBtn) {
      return
    }
    setTooltip({
      text: tooltipBtn,
      targetelement: target,
      left: `${left}`,
      widthbtn: widthToolbarBtn,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  const iconToolbar = (name) => {
    switch (name) {
      case 'bold':
        return <FaBold className="toolbar-icon" />
      case 'italic':
        return <FaItalic className="toolbar-icon" />
      case 'underline':
        return <FaUnderline className="toolbar-icon" />
      case 'color':
        return <FaBold className="toolbar-icon" />
      case 'strikethrough':
        return <FaStrikethrough className="toolbar-icon" />
      case 'align-left':
        return <FaAlignLeft className="toolbar-icon" />
      case 'align-center':
        return <FaAlignCenter className="toolbar-icon" />
      case 'align-right':
        return <FaAlignRight className="toolbar-icon" />
      case 'align-justify':
        return <FaAlignJustify className="toolbar-icon" />
      default:
        break
    }
  }

  return (
    <div className="toolbar">
      <div className="toolbar-settings">
        {listNavBtns.map((btn, i) => (
          <span
            className={`toolbar-btn toolbar--${btn}`}
            data-tooltip={btn}
            key={i}
            onClick={handleOnClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {iconToolbar(btn)}
          </span>
        ))}
        {tooltip && <Tooltip tooltip={tooltip} />}
      </div>
    </div>
  )
}

export default Toolbar
