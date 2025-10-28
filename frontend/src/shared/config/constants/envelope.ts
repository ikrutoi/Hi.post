export const ENVELOPE_ROLES = ['sender', 'recipient'] as const

export type EnvelopeRole = (typeof ENVELOPE_ROLES)[number]

export const ADDRESS_FIELDS = {
  name: 'name',
  street: 'street',
  city: 'city',
  zip: 'zip',
  country: 'country',
} as const

export type AddressField = keyof typeof ADDRESS_FIELDS

export type AddressFields = Record<AddressField, string>

export type RoleToAddressField = Record<EnvelopeRole, AddressField>

export type EnvelopeState = Record<EnvelopeRole, AddressFields>
