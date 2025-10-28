import { ADDRESS_FIELDS } from '@shared/config/constants'
import { typedKeys } from '../../application/helpers'
import type {
  AddressFields,
  EnvelopeState,
  EnvelopeRole,
} from '@shared/config/constants'

export type EnvelopeUiState = {
  sender: AddressFields
  recipient: AddressFields
  ui: {
    miniAddressClose: EnvelopeRole | null
    envelopeSave: EnvelopeRole | null
    envelopeSaveSecond: boolean | null
    envelopeRemoveAddress: boolean | null
  }
}

export const emptyAddressFields: AddressFields = typedKeys(
  ADDRESS_FIELDS
).reduce((acc, key) => {
  acc[key] = ''
  return acc
}, {} as AddressFields)

export const emptyEnvelope: EnvelopeState = {
  sender: { ...emptyAddressFields },
  recipient: { ...emptyAddressFields },
}

export interface AddressTemplateItem {
  localId: number
  id: string
  address: AddressFields
}
