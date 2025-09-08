import { Lang } from '@shared/localization/lang'
import type { EnvelopeTranslations } from '@shared/localizationLegacy/types'

export const loadEnvelopeTranslations = async (
  lang: Lang
): Promise<EnvelopeTranslations> => {
  const translations = await import(`../locales/${lang}.json`)
  return translations as EnvelopeTranslations
}
