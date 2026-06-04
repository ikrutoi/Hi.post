import { Lang } from '@i18n/types'
import { addressLabels } from '../hooks'
import type { EnvelopeRole } from '@shared/config/constants'
import type { AddressLabelsByLang } from '../hooks'

export const getAddressLabelLayout = (
  role: EnvelopeRole,
  lang: Lang
): AddressLabelsByLang[Lang] => {
  const layout = addressLabels[role][lang]
  if (layout?.length) return layout
  return addressLabels[role].en ?? []
}
