export const TEMPLATES = [
  'stockImages',
  'userImages',
  'cardtext',
  'sender',
  'recipient',
  'cart',
  'drafts',
  'sent',
] as const

export type Template = (typeof TEMPLATES)[number]
