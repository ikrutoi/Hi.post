export const allLangs = [
  'en',
  'ru',
  'de',
  'es',
  'zh',
  'fr',
  'ar',
  'tp',
  'it',
  'hi',
  'ja',
  'tr',
  'ko',
  'id',
  'uk',
  'pl',
] as const

export type Lang = (typeof allLangs)[number]
