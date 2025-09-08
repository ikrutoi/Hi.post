import { useState, useEffect } from 'react'
import { loadEnvelopeTranslations } from '@shared/localizationLegacy/loadTranslations'
import type { EnvelopeTranslations } from '@shared/localizationLegacy/types'
import type { Lang } from '@i18n/index'

export const useEnvelopeTranslations = (lang: Lang) => {
  const [t, setT] = useState<EnvelopeTranslations | null>(null)

  useEffect(() => {
    loadEnvelopeTranslations(lang).then(setT)
  }, [lang])

  return t
}
