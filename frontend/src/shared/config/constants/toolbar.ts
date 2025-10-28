export const SECTIONS_TOOLBAR = ['cardphoto', 'cardtext', 'envelope'] as const

export type SectionsToolbar = (typeof SECTIONS_TOOLBAR)[number]

export const SOURCE = ['cart', 'drafts', 'sender', 'recipient', 'date']
