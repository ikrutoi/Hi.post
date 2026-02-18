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
  MdOutlineAddShoppingCart,
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
import { TiDelete, TiPlus } from 'react-icons/ti'
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
  FaRegStar,
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
  IconCrop,
  IconCropCheck,
  IconCropFull,
  IconCropRotate,
  IconRotateLeft,
  IconRotateLeftHorizontal,
  IconRotateRight,
  IconRotateRightHorizontal,
  IconUndo,
  IconCropRotateRight,
  IconImageRotateLeft,
  IconImageRotateRight,
  IconCardVertical,
  IconCardHorizontal,
  IconCardVerticalV2,
  IconCardHorizontalV2,
  IconCardDynamic,
  IconImageReset,
  IconCloseList,
  IconDownloadV2,
  IconSaveList,
  IconDeleteSmall,
  IconPlus,
  IconAlignLeft,
  IconAlignRight,
  IconAlignCenter,
  IconAlignJustify,
  IconBold,
  IconItalic,
  IconFontFamily,
  IconFontSizePlus,
  IconFontSizeMinus,
  IconFontSizePlusV2,
  IconFontSizeMinusV2,
  IconFontSizePlusV3,
  IconFontSizeMinusV3,
  IconCircleV2,
  IconFontSizeLess,
  IconFontSizeMore,
  IconFontSizeLessV2,
  IconDeleteV2,
  IconDeleteV3,
  IconStar,
} from '@shared/ui/icons'
import { FontSizeIndicator } from '@toolbar/presentation/FontSizeIndicator'
import type { LayoutOrientation } from '@layout/domain/types'

// export const toolbarIcons = Object.fromEntries(
//   ICON_KEYS.map((key) => [key, getIconByKey(key)]),
// ) as Record<IconKey, JSX.Element>

export function getIconByKey(
  key: IconKey,
  orientation?: LayoutOrientation,
  currentStep?: number,
): JSX.Element {
  switch (key) {
    case 'save':
      return <IconSave />
    case 'savedTemplates':
      return <LuPaperclip />
    case 'saveList':
      return <IconSaveList />
    case 'saveSmall':
      return <TiPlus />
    case 'plusSmall':
      return <IconPlus />
    case 'remove':
      return <RiDeleteBinLine />
    case 'delete':
      return <IconDelete />
    case 'deleteSmall':
      return <IconDeleteV3 />
    case 'download':
      return <IconDownloadV2 />
    case 'apply':
      return <IconApply />
    case 'close':
      return <IconClose />
    case 'closeList':
      return <IconCloseList />
    case 'user':
      return <RiUserLine />
    case 'rotateLeft':
      return <IconRotateLeftHorizontal />
    case 'rotateRight':
      return <IconRotateRightHorizontal />
    case 'imageRotateLeft':
      return <IconImageRotateLeft />
    case 'imageRotateRight':
      return <IconImageRotateRight />
    case 'imageReset':
      return <IconImageReset />
    case 'cardHorizontal':
      return <IconCardHorizontalV2 />
    case 'cardVertical':
      return <IconCardVerticalV2 />
    case 'cardOrientation':
      return <IconCardDynamic orientation={orientation ?? 'landscape'} />
    case 'undo':
      return <IconUndo />
    case 'edit':
      return <FiEdit />
    case 'crop':
      return <IconCrop />
    case 'cropCheck':
      return <IconCropCheck />
    case 'cropHistory':
      return <IconCardphotoTemplates />
    case 'cropFull':
      return <IconCropFull />
    case 'cropDelete':
      return <IconClose />
    case 'cropRotate':
      return <IconCropRotateRight />
    case 'reset':
      return <RiResetLeftFill />
    case 'bold':
      return <IconBold />
    case 'underline':
      return <RiUnderline />
    case 'italic':
      return <IconItalic />
    case 'fontSize':
      return <RiFontSize2 />
    case 'fontSizePlus':
      return <IconFontSizePlusV3 />
    case 'fontSizeMore':
      return <IconFontSizeMore />
    case 'fontSizeMinus':
      return <IconFontSizeMinusV3 />
    case 'fontSizeLess':
      return <IconFontSizeLess />
    case 'fontFamily':
      return <IconFontFamily />
    case 'fontSizeIndicator':
      return <FontSizeIndicator currentStep={currentStep ?? 3} />
    case 'color':
      return <RiFontColor />
    case 'left':
      return <IconAlignLeft />
    case 'center':
      return <IconAlignCenter />
    case 'right':
      return <IconAlignRight />
    case 'justify':
      return <IconAlignJustify />
    case 'plus':
      return <FiPlus />
    case 'arrowsOut':
      return <HiArrowsPointingOut />
    case 'arrowsIn':
      return <HiArrowsPointingIn />
    case 'cart':
      return <FaEnvelope />
    case 'addCart':
      return <MdOutlineAddShoppingCart />
    case 'drafts':
      return <FaEnvelopeOpen />
    case 'addDrafts':
      return <IconStar />
    case 'cards':
      return <PiCardsBold />
    case 'cardUser':
      return <IconEnvelopeTemplatesV5 />
    case 'addressTemplates':
      return <IconAddressTemplates />
    case 'cardText':
      return <BsCardText />
    case 'textList':
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
    case 'date':
      return <IconSectionMenuDate />
    case 'favorite':
      return <IconStar />
  }
}
