import type { ViewportSize } from './size'

export const ICON_KEYS = [
  'save',
  'savedTemplates',
  'delete',
  'remove',
  'deleteSmall',
  'download',
  'apply',
  'close',
  'user',
  'rotateLeft',
  'rotateRight',
  'edit',
  'crop',
  'cropCheck',
  'cropHistory',
  'cropFull',
  'cropRotate',
  'cropDelete',
  'rotateRight',
  'rotateLeft',
  'imageRotateLeft',
  'imageRotateRight',
  'imageReset',
  'cardHorizontal',
  'cardVertical',
  'cardOrientation',
  'undo',
  'reset',
  'bold',
  'underline',
  'italic',
  'fontSize',
  'color',
  'left',
  'center',
  'right',
  'justify',
  'plus',
  'arrowsOut',
  'arrowsIn',
  'cart',
  'addCart',
  'drafts',
  'addDrafts',
  'cards',
  'cardUser',
  'cardText',
  'textList',
  'photoTemplates',
  'addressList',
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
  'deleteList',
  'saveList',
  'saveSmall',
  'plusSmall',
  'fontFamily',
  'fontSizePlus',
  'fontSizeMinus',
  'fontSizeIndicator',
  'fontSizeMore',
  'fontSizeLess',
  'favorite',
  'addressPlus',
  'clearInput',
] as const

export type IconKey = (typeof ICON_KEYS)[number]

export const ICON_STATE = ['disabled', 'enabled', 'active']

export type IconState = (typeof ICON_STATE)[number]

// export type IconValue =
//   | IconState
//   | {
//       state: IconState
//       badge?: number | null
//     }

export type UpdateIconPayloadValue =
  | IconState
  | {
      state?: IconState
      badge?: number | null
    }

export const ICON_STATE_GROUP = ['disabled', 'enabled'] as const

export type IconStateGroup = (typeof ICON_STATE)[number]

export const ICON_SIZE_MAP: Record<ViewportSize, string> = {
  xs: '1rem',
  sm: '1.1rem',
  md: '1.2rem',
  lg: '1.3rem',
  xl: '1.4rem',
}
