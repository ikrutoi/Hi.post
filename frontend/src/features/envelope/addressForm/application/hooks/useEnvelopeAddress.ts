import { useMemo } from 'react'
import { getAddressLabelLayout } from '../helpers'
import type { Lang } from '@i18n/types'
import type { EnvelopeRole } from '@shared/config/constants'

export const useEnvelopeAddress = (role: EnvelopeRole, lang: Lang) => {
  const labelLayout = useMemo(
    () => getAddressLabelLayout(role, lang),
    [role, lang]
  )
  return { labelLayout }
}
