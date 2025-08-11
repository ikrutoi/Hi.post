import type { AddressField, AddressRole } from '@features/envelope/types'
import { Lang, allLangs } from '@i18n/index'

export interface AddressLabel {
  label: string
  field: AddressField
}

const createEmptyLabels = (): AddressLabelsByLang =>
  allLangs.reduce((acc, lang) => {
    acc[lang] = []
    return acc
  }, {} as AddressLabelsByLang)

export type AddressLabelGroup = AddressLabel[]

export type AddressLabelLayout = Array<AddressLabel | AddressLabelGroup>

export type AddressLabelsByLang = {
  [key in Lang]: AddressLabelLayout
}

export const addressLabels: Readonly<Record<AddressRole, AddressLabelsByLang>> =
  {
    sender: {
      ...createEmptyLabels(),
      en: [
        { label: '1-Street / House', field: 'street' },
        [
          { label: '2-City', field: 'city' },
          { label: '3-Zip', field: 'zip' },
        ],
        { label: '4-Country', field: 'country' },
        { label: '5-Name', field: 'name' },
      ],
    },
    recipient: {
      ...createEmptyLabels(),
      en: [
        { label: '1-Name', field: 'name' },
        { label: '2-Street / House', field: 'street' },
        [
          { label: '3-Zip', field: 'zip' },
          { label: '4-City', field: 'city' },
        ],
        { label: '5-Country', field: 'country' },
      ],
    },
  }

export const getAddressLabelLayout = (
  role: AddressRole,
  lang: Lang
): AddressLabelLayout => {
  return addressLabels[role][lang] ?? []
}
