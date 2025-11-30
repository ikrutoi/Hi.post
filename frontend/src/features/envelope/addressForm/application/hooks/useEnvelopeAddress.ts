import { useMemo } from 'react'
import { ENVELOPE_KEYS } from '@toolbar/domain/types'
import { getAddressLabelLayout } from '../helpers'
// import { useAddressCount } from './useAddressCount'
import type { Lang } from '@i18n/types'
import type { EnvelopeRole } from '@shared/config/constants'
import type { EnvelopeToolbarKey } from '@toolbar/domain/types'

export const useEnvelopeAddress = (role: EnvelopeRole, lang: Lang) => {
  const labelLayout = useMemo(
    () => getAddressLabelLayout(role, lang),
    [role, lang]
  )
  // const count = useAddressCount(role)
  const count = 5
  const buttons: readonly EnvelopeToolbarKey[] = ENVELOPE_KEYS

  return { labelLayout, count, buttons }
}
