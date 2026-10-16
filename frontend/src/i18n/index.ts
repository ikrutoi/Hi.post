export { DEFAULT_LANG } from './config'
export { dateMonthUpperLabel, dateWeekdayLabel } from './catalogs/date'
export { LANG_ENDONYMS, LANGS_BY_ENDONYM } from './catalogs/languageNames'
export {
  getActiveLang,
  setLangPreference,
  useLangSnapshot,
} from './langPreference'
export type { LangPreference } from './langPreference'
export type { Lang } from './types'
