import { ADDRESS_FIELDS } from '@shared/config/constants'
import type { AddressLabelLayout } from '../../../domain/types'

export const senderEnLayout: AddressLabelLayout = [
  { label: '1-Street / House', field: ADDRESS_FIELDS.street },
  [
    { label: '2-City', field: ADDRESS_FIELDS.city },
    { label: '3-Zip', field: ADDRESS_FIELDS.zip },
  ],
  { label: '4-Country', field: ADDRESS_FIELDS.country },
  { label: '5-Name', field: ADDRESS_FIELDS.name },
]

export const recipientEnLayout: AddressLabelLayout = [
  { label: '1-Name', field: ADDRESS_FIELDS.name },
  { label: '2-Street / House', field: ADDRESS_FIELDS.street },
  [
    { label: '3-Zip', field: ADDRESS_FIELDS.zip },
    { label: '4-City', field: ADDRESS_FIELDS.city },
  ],
  { label: '5-Country', field: ADDRESS_FIELDS.country },
]
