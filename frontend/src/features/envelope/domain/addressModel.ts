export interface Address {
  name: string
  street: string
  city: string
  zip: string
  country: string
}

export const initialAddress: Address = {
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
}

export type AddressRole = 'sender' | 'recipient'
export const ADDRESS_ROLES: AddressRole[] = ['sender', 'recipient']

export type AddressField = keyof Address

export interface EnvelopeAddresses {
  sender: Address
  recipient: Address
}

export const initialEnvelopeAddresses: EnvelopeAddresses = {
  sender: { ...initialAddress },
  recipient: { ...initialAddress },
}

export interface AddressLabel {
  field: AddressField
  label: string
}
