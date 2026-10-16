import { Langs } from '../types'
import { DEFAULT_LANG } from '../config'
import type { Lang } from '../types'

/** `ru-BY` and `ru_RU` become `ru`. Unknown tags return null. */
export const normalizeLang = (lang: string): Lang | null => {
  const primary = lang.trim().toLowerCase().split(/[-_]/)[0]
  if (!primary) return null
  return Langs.includes(primary as Lang) ? (primary as Lang) : null
}

export const getSafeLang = (lang: string): Lang => {
  return normalizeLang(lang) ?? DEFAULT_LANG
}
