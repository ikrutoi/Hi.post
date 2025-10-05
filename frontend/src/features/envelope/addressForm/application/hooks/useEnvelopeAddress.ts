import { useMemo } from 'react'
import { getAddressLabelLayout } from '@i18n/index'
import { useAddressCount } from './useAddressCount'
import type { AddressRole } from '@envelope/domain/types'
import type { Lang } from '@i18n/langs'

export const useEnvelopeAddress = (role: AddressRole, lang: Lang) => {
  const labelLayout = useMemo(
    () => getAddressLabelLayout(role, lang),
    [role, lang]
  )
  const count = useAddressCount(role)
  const buttons = ['save', 'delete', 'clip'] as const

  return { labelLayout, count, buttons }
}
