import { useState, useEffect } from 'react'
import { loadEnvelopeTranslations } from 'shared-legacy/localizationLegacy/loadTranslations'
import type { EnvelopeTranslations } from 'shared-legacy/localizationLegacy/types'
import type { Lang } from '@i18n/index'

export const useEnvelopeTranslations = (lang: Lang) => {
  const [t, setT] = useState<EnvelopeTranslations | null>(null)

  useEffect(() => {
    loadEnvelopeTranslations(lang).then(setT)
  }, [lang])

  return t
}
