import type { Address, AddressRole, EnvelopeAddresses } from '../types'

export const initialAddress: Address = {
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
}

export const ADDRESS_ROLES: AddressRole[] = ['sender', 'recipient']

export const initialEnvelopeAddresses: EnvelopeAddresses = {
  sender: { ...initialAddress },
  recipient: { ...initialAddress },
}
