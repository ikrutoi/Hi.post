import { Lang } from '../types'
import type { EnvelopeTranslations } from '../types'

export const loadEnvelopeTranslations = async (
  lang: Lang
): Promise<EnvelopeTranslations> => {
  const translations = await import(`../locales/${lang}.json`)
  return translations as EnvelopeTranslations
}
