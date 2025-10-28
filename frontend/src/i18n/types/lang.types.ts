export const Langs = [
  'en',
  'ru',
  'de',
  'es',
  'zh',
  'fr',
  'ar',
  'pt',
  'it',
  'hi',
  'ja',
  'tr',
  'ko',
  'id',
  'uk',
  'pl',
] as const

export type Lang = (typeof Langs)[number]
