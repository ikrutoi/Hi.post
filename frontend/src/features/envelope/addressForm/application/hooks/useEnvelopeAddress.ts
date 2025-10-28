import { useMemo } from 'react'
import { ENVELOPE_KEYS } from '@toolbar/domain/types'
import { getAddressLabelLayout } from '../helpers'
import { useAddressCount } from './useAddressCount'
import type { Lang } from '@i18n/types'
import type { EnvelopeRole } from '@shared/config/constants'

export const useEnvelopeAddress = (role: EnvelopeRole, lang: Lang) => {
  const labelLayout = useMemo(
    () => getAddressLabelLayout(role, lang),
    [role, lang]
  )
  const count = useAddressCount(role)
  const buttons = ENVELOPE_KEYS

  return { labelLayout, count, buttons }
}
