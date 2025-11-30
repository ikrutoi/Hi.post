import { Lang } from '@i18n/types'
import { addressLabels } from '../hooks'
import type { EnvelopeRole } from '@shared/config/constants'
import type { AddressLabelsByLang } from '../hooks'

export const getAddressLabelLayout = (
  role: EnvelopeRole,
  lang: Lang
): AddressLabelsByLang[Lang] => {
  return addressLabels[role][lang] ?? []
}
