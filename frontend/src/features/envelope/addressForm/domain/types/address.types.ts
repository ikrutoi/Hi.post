import { ADDRESS_FIELDS_LABELLED } from '@shared/config/constants'
import type { AddressField, AddressFieldLabel } from '@shared/config/constants'

export type AddressFieldItem = {
  key: AddressField
  label: AddressFieldLabel
}

export type AddressLayout = (AddressFieldItem | AddressFieldItem[])[]

export const byKey: Record<AddressField, AddressFieldItem> = Object.fromEntries(
  ADDRESS_FIELDS_LABELLED.map((item) => [item.key, item])
) as Record<AddressField, AddressFieldItem>
