import type { ViewportSize } from './size'

export const ICON_KEYS = [
  'save',
  'savedTemplates',
  'delete',
  'remove',
  'deleteSmall',
  'download',
  'user',
  'turn',
  'edit',
  'fillFrame',
  'crop',
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
  'textTemplates',
  'photoTemplates',
  'addressTemplates',
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
  'date',
] as const

export type IconKey = (typeof ICON_KEYS)[number]

export const ICON_STATE = ['disabled', 'enabled', 'active']

export type IconState = (typeof ICON_STATE)[number]

export const ICON_SIZE_MAP: Record<ViewportSize, string> = {
  xs: '1rem',
  sm: '1.1rem',
  md: '1.2rem',
  lg: '1.3rem',
  xl: '1.4rem',
}
