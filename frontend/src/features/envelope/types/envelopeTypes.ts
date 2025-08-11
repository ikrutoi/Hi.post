export type AddressRole = 'sender' | 'recipient'
export const ADDRESS_ROLES: AddressRole[] = ['sender', 'recipient']

export const initialAddress = {
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
} as const

export interface AddressLabel {
  field: AddressField
  label: string
}

export type AddressField = keyof typeof initialAddress

export type Address = Record<AddressField, string>

export type EnvelopeAddresses = Record<AddressRole, Address>
