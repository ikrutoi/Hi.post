export const SOURCES = ['cart', 'drafts'] as const

export type Source = (typeof SOURCES)[number]
