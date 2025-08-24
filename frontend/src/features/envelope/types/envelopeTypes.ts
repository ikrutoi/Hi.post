export type AddressRole = 'sender' | 'recipient'
export const ADDRESS_ROLES: AddressRole[] = ['sender', 'recipient']

export interface AddressLabel {
  field: AddressField
  label: string
}

export type AddressField = keyof import('./baseAddress').BaseAddress
