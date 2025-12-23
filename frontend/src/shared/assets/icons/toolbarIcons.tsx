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
import { TiDelete } from 'react-icons/ti'
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
import {
  FaRegIdCard,
  FaRegAddressCard,
  FaEnvelopeOpen,
  FaEnvelope,
  FaEnvelopeOpenText,
} from 'react-icons/fa'
import { FaRegImage } from 'react-icons/fa6'
import {
  TbArrowsMaximize,
  TbMail,
  TbMailPlus,
  TbMailOpened,
  TbPhoto,
  TbCalendar,
  TbAlignBoxCenterMiddle,
  TbAlertTriangle,
} from 'react-icons/tb'
import {
  BsEnvelope,
  BsEnvelopePaper,
  BsEnvelopePlus,
  BsEnvelopeOpen,
  BsCardText,
} from 'react-icons/bs'
import { HiArrowsPointingOut, HiArrowsPointingIn } from 'react-icons/hi2'
import { ICON_KEYS } from '../../config/constants'
import type { IconKey } from '@shared/config/constants'

import {
  IconSectionMenuCardphoto,
  IconSectionMenuCardtext,
  IconSectionMenuEnvelope,
  IconSectionMenuEnvelopeV2,
  IconSectionMenuAroma,
  IconSectionMenuAromaV2,
  IconSectionMenuDate,
  IconCardphotoTemplates,
  IconCardtextTemplates,
  IconAddressTemplates,
  IconEnvelopeTemplatesV5,
  IconCardPlus,
  IconDelete,
  IconSave,
  IconDownload,
  IconApply,
  IconClose,
} from '@shared/ui/icons'

export const toolbarIcons = Object.fromEntries(
  ICON_KEYS.map((key) => [key, getIconByKey(key)])
) as Record<IconKey, JSX.Element>

function getIconByKey(key: IconKey): JSX.Element {
  switch (key) {
    case 'save':
      return <IconSave />
    case 'savedTemplates':
      return <LuPaperclip />
    case 'remove':
      return <RiDeleteBinLine />
    case 'delete':
      return <IconDelete />
    case 'deleteSmall':
      return <TiDelete />
    case 'download':
      return <IconDownload />
    case 'apply':
      return <IconApply />
    case 'close':
      return <IconClose />
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
      return <FaEnvelope />
    case 'addCart':
      return <IconCardPlus />
    case 'drafts':
      return <FaEnvelopeOpen />
    case 'addDrafts':
      return <IconSave />
    case 'cards':
      return <PiCardsBold />
    case 'cardUser':
      return <IconEnvelopeTemplatesV5 />
    case 'addressTemplates':
      return <IconAddressTemplates />
    case 'cardText':
      return <BsCardText />
    case 'textTemplates':
      return <IconCardtextTemplates />
    case 'photoTemplates':
      return <IconCardphotoTemplates />
    case 'cardphoto':
      return <IconSectionMenuCardphoto />
    case 'cardtext':
      return <IconSectionMenuCardtext />
    case 'envelope':
      return <IconSectionMenuEnvelopeV2 />
    case 'aroma':
      return <IconSectionMenuAromaV2 />
    case 'date':
      return <IconSectionMenuDate />
  }
}
