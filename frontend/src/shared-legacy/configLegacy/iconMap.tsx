import { JSX } from 'react/jsx-runtime'

import {
  FiSave, FiDelete, FiDownload, FiEdit, FiCrop, FiPlus,
} from 'react-icons/fi'
import { LuPaperclip } from 'react-icons/lu'
import {
  MdDeleteOutline, MdOutlineShoppingCart, MdAddShoppingCart,
} from 'react-icons/md'
import {
  RiUserLine, RiResetLeftFill, RiBold, RiItalic, RiFontSize2,
  RiFontColor, RiAlignLeft, RiAlignCenter, RiAlignRight, RiAlignJustify,
} from 'react-icons/ri'
import { PiArrowClockwiseFill } from 'react-icons/pi'
import { TbArrowsMaximize } from 'react-icons/tb'
import { HiArrowsPointingOut, HiArrowsPointingIn } from 'react-icons/hi2'

export type IconKey =
  | 'save' | 'clip' | 'delete' | 'remove' | 'download' | 'user' | 'turn'
  | 'edit' | 'maximaze' | 'crop' | 'reset' | 'bold' | 'italic'
  | 'fontSize' | 'color' | 'left' | 'center' | 'right' | 'justify'
  | 'shopping' | 'addShopping' | 'plus' | 'arrowsOut' | 'arrowsIn'

export const iconMap: Record<IconKey, JSX.Element> = {
  save: <FiSave className="toolbar-icon" />,
  clip: <LuPaperclip className="toolbar-icon" />,
  delete: <FiDelete className="toolbar-icon" />,
  remove: <MdDeleteOutline className="toolbar-icon" />,
  download: <FiDownload className="toolbar-icon" />,
  user: <RiUserLine className="toolbar-icon" />,
  turn: <PiArrowClockwiseFill className="toolbar-icon" />,
  edit: <FiEdit className="toolbar-icon" />,
  maximaze: <TbArrowsMaximize className="toolbar-icon" />,
  crop: <FiCrop className="toolbar-icon" />,
  reset: <RiResetLeftFill className="toolbar-icon" />,
  bold: <RiBold className="toolbar-icon" />,
  italic: <RiItalic className="toolbar-icon" />,
  fontSize: <RiFontSize2 className="toolbar-icon toolbar-icon-font-size" />,
  color: <RiFontColor className="toolbar-icon toolbar-icon-a" />,
  left: <RiAlignLeft className="toolbar-icon" />,
  center: <RiAlignCenter className="toolbar-icon" />,
  right: <RiAlignRight className="toolbar-icon" />,
  justify: <RiAlignJustify className="toolbar-icon" />,
  shopping: <MdOutlineShoppingCart className="toolbar-icon" />,
  addShopping: <MdAddShoppingCart className="toolbar-icon" />,
  plus: <FiPlus className="toolbar-icon" />,
  arrowsOut: <HiArrowsPointingOut className="fullcard-icon" />,
  arrowsIn: <HiArrowsPointingIn className="fullcard-icon" />,
}
