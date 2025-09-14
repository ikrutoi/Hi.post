export interface Address {
  name: string
  street: string
  city: string
  zip: string
  country: string
}

export type AddressRole = 'sender' | 'recipient'

export type AddressField = keyof Address

export interface EnvelopeAddresses {
  sender: Address
  recipient: Address
}

export interface AddressLabel {
  field: AddressField
  label: string
}
