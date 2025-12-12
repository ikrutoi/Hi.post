import { JSX } from 'react/jsx-runtime'
import {
  FiSave,
  FiDelete,
  FiDownload,
  FiEdit,
  FiCrop,
  FiPlus,
} from 'react-icons/fi'
import {
  MdDeleteOutline,
  MdOutlineDeleteForever,
  MdOutlineShoppingCart,
  MdAddShoppingCart,
  MdOutlineDrafts,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatColorText,
  MdFormatSize,
  MdAlignHorizontalLeft,
  MdAlignHorizontalRight,
  MdAlignHorizontalCenter,
  MdFormatAlignJustify,
} from 'react-icons/md'
import { LuPaperclip, LuMail, LuMailOpen, LuMailPlus } from 'react-icons/lu'
import { BsCardText } from 'react-icons/bs'
import {
  RiUserLine,
  RiResetLeftFill,
  RiBold,
  RiItalic,
  RiUnderline,
  RiFontSize2,
  RiFontColor,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiDeleteBin2Line,
  RiDeleteBinLine,
  RiSaveLine,
  RiIdCardLine,
  RiMailAddLine,
  RiMailOpenLine,
  RiMailLine,
  RiTextSnippet,
  RiTextBlock,
} from 'react-icons/ri'
import {
  PiCards,
  PiCardsBold,
  PiArrowClockwiseFill,
  PiCardsThreeBold,
} from 'react-icons/pi'
import { FaRegIdCard, FaRegAddressCard } from 'react-icons/fa'
import {
  TbArrowsMaximize,
  TbMail,
  TbMailPlus,
  TbMailOpened,
} from 'react-icons/tb'
import { HiArrowsPointingOut, HiArrowsPointingIn } from 'react-icons/hi2'
import { ICON_KEYS } from '../../config/constants'
import type { IconKey } from '@shared/config/constants'

export const toolbarIcons = Object.fromEntries(
  ICON_KEYS.map((key) => [key, getIconByKey(key)])
) as Record<IconKey, JSX.Element>

function getIconByKey(key: IconKey): JSX.Element {
  switch (key) {
    case 'save':
      return <FiSave />
    case 'savedTemplates':
      return <LuPaperclip />
    case 'delete':
      return <FiDelete />
    case 'remove':
      return <RiDeleteBinLine />
    case 'download':
      return <FiDownload />
    case 'user':
      return <RiUserLine />
    case 'turn':
      return <PiArrowClockwiseFill />
    case 'edit':
      return <FiEdit />
    case 'fillFrame':
      return <TbArrowsMaximize />
    case 'crop':
      return <FiCrop />
    case 'reset':
      return <RiResetLeftFill />
    case 'bold':
      return <RiBold />
    case 'underline':
      return <RiUnderline />
    case 'italic':
      return <RiItalic />
    case 'fontSize':
      return <RiFontSize2 />
    case 'color':
      return <RiFontColor />
    case 'left':
      return <RiAlignLeft />
    case 'center':
      return <RiAlignCenter />
    case 'right':
      return <RiAlignRight />
    case 'justify':
      return <RiAlignJustify />
    case 'plus':
      return <FiPlus />
    case 'arrowsOut':
      return <HiArrowsPointingOut />
    case 'arrowsIn':
      return <HiArrowsPointingIn />
    case 'cart':
      return <TbMail />
    case 'addCart':
      return <TbMailPlus />
    case 'drafts':
      return <TbMailOpened />
    case 'addDrafts':
      return <FiSave />
    case 'cards':
      return <PiCardsBold />
    case 'cardUser':
      return <FaRegAddressCard />
    case 'cardText':
      return <BsCardText />
    case 'textTemplates':
      return <PiCardsThreeBold />
  }
}
