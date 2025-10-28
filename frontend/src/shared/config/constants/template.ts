export const TEMPLATES = [
  'cardphoto',
  'cardtext',
  'sender',
  'recipient',
  'cart',
  'drafts',
  'sent',
] as const

export type Template = (typeof TEMPLATES)[number]
