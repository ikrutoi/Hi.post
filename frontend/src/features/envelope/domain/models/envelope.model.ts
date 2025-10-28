import type { AddressFields, EnvelopeState } from '@shared/config/constants'

export const initialAddressFields: AddressFields = {
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
}

export const initialEnvelopeAddresses: EnvelopeState = {
  sender: { ...initialAddressFields },
  recipient: { ...initialAddressFields },
}
