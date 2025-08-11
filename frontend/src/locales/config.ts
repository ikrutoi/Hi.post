export const supportedLangs = ['en'] as const
export type Lang = (typeof supportedLangs)[number]

export const defaultLang: Lang = 'en'
