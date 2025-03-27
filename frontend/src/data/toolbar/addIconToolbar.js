// import { FiSave, FiDelete } from 'react-icons/fi'
import { FiPaperclip, FiPlus } from 'react-icons/fi'
import { LuPaperclip } from 'react-icons/lu'
import { FiEdit, FiDownload, FiSave, FiDelete, FiCrop } from 'react-icons/fi'
import { PiArrowClockwiseFill } from 'react-icons/pi'
// import { RiResetLeftFill } from 'react-icons/ri'
import { TbArrowsMaximize } from 'react-icons/tb'
import { HiArrowsPointingIn, HiArrowsPointingOut } from 'react-icons/hi2'
import {
  RiBold,
  RiItalic,
  RiFontSize2,
  RiFontColor,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiResetLeftFill,
} from 'react-icons/ri'

export const addIconToolbar = (icon) => {
  switch (icon) {
    case 'save':
      return <FiSave className="toolbar-icon" />
    case 'clip':
      return <LuPaperclip className="toolbar-icon" />
    case 'delete':
      return <FiDelete className="toolbar-icon" />
    case 'download':
      return <FiDownload className="toolbar-icon" />
    case 'turn':
      return <PiArrowClockwiseFill className="toolbar-icon" />
    case 'edit':
      return <FiEdit className="toolbar-icon" />
    case 'maximaze':
      return <TbArrowsMaximize className="toolbar-icon" />
    case 'crop':
      return <FiCrop className="toolbar-icon" />
    case 'reset':
      return <RiResetLeftFill className="toolbar-icon" />
    case 'bold':
      return <RiBold className="toolbar-icon" />
    case 'italic':
      return <RiItalic className="toolbar-icon" />
    case 'fontSize':
      return <RiFontSize2 className="toolbar-icon toolbar-icon-font-size" />
    case 'color':
      return <RiFontColor className="toolbar-icon toolbar-icon-a" />
    case 'left':
      return <RiAlignLeft className="toolbar-icon" />
    case 'center':
      return <RiAlignCenter className="toolbar-icon" />
    case 'right':
      return <RiAlignRight className="toolbar-icon" />
    case 'justify':
      return <RiAlignJustify className="toolbar-icon" />
    case 'plus':
      return <FiPlus className="fullcard-icon" />
    case 'arrowsOut':
      return <HiArrowsPointingOut className="fullcard-icon" />
    case 'arrowsIn':
      return <HiArrowsPointingIn className="fullcard-icon" />

    default:
      break
  }
}
