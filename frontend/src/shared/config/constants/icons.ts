export const ICON_KEYS = [
  'save',
  'savedTemplates',
  'delete',
  'remove',
  'download',
  'user',
  'turn',
  'edit',
  'fillFrame',
  'crop',
  'reset',
  'bold',
  'italic',
  'fontSize',
  'color',
  'left',
  'center',
  'right',
  'justify',
  'cart',
  'addCart',
  'plus',
  'arrowsOut',
  'arrowsIn',
  'cart',
  'drafts',
] as const

export type IconKey = (typeof ICON_KEYS)[number]

export const ICON_STATE = ['disabled', 'enabled', 'active']

export type IconState = (typeof ICON_STATE)[number]
