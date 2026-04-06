export const TEMPLATES = [
  'stockImages',
  'userImages',
  'cardtext',
  'sender',
  'recipient',
  'cart',
  'drafts',
] as const

export type Template = (typeof TEMPLATES)[number]
