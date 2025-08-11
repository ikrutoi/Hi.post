import { en } from './en/common'

export const translations = {
  en,
}

export type SupportedLang = keyof typeof translations

export const t = <T = unknown>(
  lang: SupportedLang,
  path: string
): T | string => {
  const segments = path.split('.')
  let current: any = translations[lang]

  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment]
    } else {
      return path
    }
  }

  return current
}
