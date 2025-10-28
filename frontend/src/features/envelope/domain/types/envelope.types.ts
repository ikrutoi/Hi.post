import { Lang } from '@i18n/index'
import { ADDRESS_FIELDS } from '@shared/config/constants'

export type AddressKey = keyof typeof ADDRESS_FIELDS

export interface AddressLabel {
  label: string
  field: AddressKey
}

export type AddressLabelGroup = AddressLabel[]

export type AddressLabelLayout = Array<AddressLabel | AddressLabelGroup>

export type AddressLabelsByLang = {
  [key in Lang]: AddressLabelLayout
}
