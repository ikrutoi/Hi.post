import { Langs } from '../types'
import { DEFAULT_LANG } from '../config'
import type { Lang } from '../types'

export const getSafeLang = (lang: string): Lang => {
  return Langs.includes(lang as Lang) ? (lang as Lang) : DEFAULT_LANG
}
