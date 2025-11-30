import type { AddressField, AddressFieldLabel } from '@shared/config/constants'
import { ADDRESS_FIELDS_LABELLED } from '@shared/config/constants'

export type AddressFieldItem = {
  key: AddressField
  label: AddressFieldLabel
}

export type AddressLayout = (AddressFieldItem | AddressFieldItem[])[]

const byKey = Object.fromEntries(
  ADDRESS_FIELDS_LABELLED.map((item) => [item.key, item])
) as Record<AddressField, AddressFieldItem>

export const senderLayout: AddressLayout = [
  byKey.name,
  byKey.street,
  [byKey.zip, byKey.city],
  byKey.country,
]

export const recipientLayout: AddressLayout = [
  byKey.name,
  byKey.street,
  [byKey.zip, byKey.city],
  byKey.country,
]
