import { Langs, type Lang } from '../types'

/** Name of each language, written in that language. */
export const LANG_ENDONYMS: Record<Lang, string> = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
  es: 'Español',
  zh: '中文',
  fr: 'Français',
  ar: 'العربية',
  pt: 'Português',
  it: 'Italiano',
  hi: 'हिन्दी',
  ja: '日本語',
  tr: 'Türkçe',
  ko: '한국어',
  id: 'Indonesia',
  uk: 'Українська',
  pl: 'Polski',
}

export const LANGS_BY_ENDONYM: readonly Lang[] = [...Langs].sort((a, b) =>
  LANG_ENDONYMS[a].localeCompare(LANG_ENDONYMS[b]),
)
