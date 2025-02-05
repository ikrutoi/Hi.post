import { createRef, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaAngleDown,
} from 'react-icons/fa'
import { ImFontSize, ImTextColor } from 'react-icons/im'
import { BiFontColor } from 'react-icons/bi'
import { BsDash } from 'react-icons/bs'
import { GoDash } from 'react-icons/go'
import {
  CgFormatBold,
  CgFormatItalic,
  CgFormatColor,
  CgFormatLeft,
  CgFormatCenter,
  CgFormatRight,
  CgFormatJustify,
} from 'react-icons/cg'
import {
  TbBold,
  TbItalic,
  TbTextSize,
  TbTextColor,
  TbAlignLeft,
  TbAlignCenter,
  TbAlignRight,
  TbAlignJustified,
} from 'react-icons/tb'
import { AiOutlineFontColors } from 'react-icons/ai'
import {
  MdOutlineFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdOutlineFormatSize,
  MdFormatColorText,
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
} from 'react-icons/md'
import './ToolbarCardtext.scss'
import listNavBtns from '../../../../../data/cardtext/list-textarea-nav-btns.json'
import Tooltip from './Tooltip/Tooltip'
import ToolbarColor from './ToolbarColor/ToolbarColor'
import { addCardtext } from '../../../../../redux/CardFormNav/actionCreators'

const ToolbarCardtext = ({
  // handleClickToolbar,
  cardtext,
  toolbarColor,
  // btnRefs,
  handleClickColor,
  toolbarIconColor,
}) => {
  const [tooltip, setTooltip] = useState(null)

  const dispatch = useDispatch()

  const handleClickToolbar = (evt, i) => {
    console.log('*', evt, i)
    // dispatch(addCardtext({ italic: true }))
    dispatch(addCardtext({ btn: evt.target }))
  }

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
      targetElement: target,
      left: `${left}`,
      widthbtn: widthToolbarBtn,
    })
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  const iconItalicRef = useRef(null)
  // const handleChoiceActive = (icon) => {
  //   if (icon === cardtext.textAlign || icon === cardtext.fontStyle) {
  //     return 'rgb(71, 71, 71)'
  //   }
  // }

  const iconToolbar = (name) => {
    switch (name) {
      case 'bold':
        return <FaBold className="cardformnav-toolbar-icon" />
      case 'italic':
        return (
          <FaItalic
            ref={iconItalicRef}
            className="cardformnav-toolbar-icon"
            // style={{ color: handleChoiceActive('italic') }}
          />
        )
      case 'font-size':
        return (
          <span className="toolbar-font-size-full">
            <MdOutlineFormatSize className="cardformnav-toolbar-icon toolbar-icon-font-size" />
            <FaAngleDown className="toolbar-icon" />
          </span>
        )
      case 'underline':
        return <MdFormatUnderlined className="cardformnav-toolbar-icon" />
      case 'color':
        return (
          <span className="toolbar-font-size-full">
            <span className="cardformnav-toolbar-icon toolbar-icon-color">
              <ImTextColor className="cardformnav-toolbar-icon toolbar-icon-a" />
              <span
                className="toolbar-icon-dash"
                // style={{ backgroundColor: toolbarIconColor }}
              ></span>
            </span>
            <FaAngleDown className="cardformnav-toolbar-iconn" />
          </span>
        )
      case 'strikethrough':
        return <FaStrikethrough className="cardformnav-toolbar-icon" />
      case 'left':
        return (
          <FaAlignLeft
            className="cardformnav-toolbar-icon"
            // style={{ color: handleChoiceActive('left') }}
          />
        )
      case 'center':
        return (
          <FaAlignCenter
            className="cardformnav-toolbar-icon"
            // style={{ color: handleChoiceActive('center') }}
          />
        )
      case 'right':
        return (
          <FaAlignRight
            className="cardformnav-toolbar-icon"
            // style={{ color: handleChoiceActive('right') }}
          />
        )
      case 'justify':
        return (
          <FaAlignJustify
            className="cardformnav-toolbar-icon"
            // style={{ color: handleChoiceActive('justify') }}
          />
        )
      default:
        break
    }
  }

  // useEffect(() => {
  //   btnRefs.current = listNavBtns.map(
  //     (_, i) => btnRefs.current[i] ?? createRef()
  //   )
  // }, [btnRefs])

  return (
    <div className="toolbar-cardtext">
      <div className="toolbar-cardtext-settings">
        {listNavBtns.map((btn, i) => (
          <span
            className={`toolbar-cardtext-btn toolbar--${btn}`}
            data-tooltip={btn}
            key={i}
            // ref={btnRefs.current[i]}
            onClick={(event) => handleClickToolbar(event, i)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {iconToolbar(btn)}
          </span>
        ))}
        {/* {tooltip && <Tooltip tooltip={tooltip} />} */}
      </div>
      <div className="toolbar-cardtext-more">
        {/* {toolbarColor && (
          <ToolbarColor
            color={toolbarColor.color}
            handleClickColor={handleClickColor}
          />
        )} */}
      </div>
    </div>
  )
}

export default ToolbarCardtext
