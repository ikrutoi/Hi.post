import { JSX } from 'react/jsx-runtime'
import {
  FiSave,
  FiDelete,
  FiDownload,
  FiEdit,
  FiCrop,
  FiPlus,
} from 'react-icons/fi'
import { LuPaperclip } from 'react-icons/lu'
import {
  MdDeleteOutline,
  MdOutlineShoppingCart,
  MdAddShoppingCart,
} from 'react-icons/md'
import {
  RiUserLine,
  RiResetLeftFill,
  RiBold,
  RiItalic,
  RiFontSize2,
  RiFontColor,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
} from 'react-icons/ri'
import { PiArrowClockwiseFill } from 'react-icons/pi'
import { TbArrowsMaximize } from 'react-icons/tb'
import { HiArrowsPointingOut, HiArrowsPointingIn } from 'react-icons/hi2'

import type { IconKey } from '@shared/types'

export const toolbarIcons: Record<IconKey, JSX.Element> = {
  save: <FiSave />,
  clip: <LuPaperclip />,
  delete: <FiDelete />,
  remove: <MdDeleteOutline />,
  download: <FiDownload />,
  user: <RiUserLine />,
  turn: <PiArrowClockwiseFill />,
  edit: <FiEdit />,
  fillFrame: <TbArrowsMaximize />,
  crop: <FiCrop />,
  reset: <RiResetLeftFill />,
  bold: <RiBold />,
  italic: <RiItalic />,
  fontSize: <RiFontSize2 />,
  color: <RiFontColor />,
  left: <RiAlignLeft />,
  center: <RiAlignCenter />,
  right: <RiAlignRight />,
  justify: <RiAlignJustify />,
  cart: <MdOutlineShoppingCart />,
  addCart: <MdAddShoppingCart />,
  plus: <FiPlus />,
  arrowsOut: <HiArrowsPointingOut />,
  arrowsIn: <HiArrowsPointingIn />,
}
