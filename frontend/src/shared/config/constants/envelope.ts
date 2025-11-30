export const ENVELOPE_ROLES = ['sender', 'recipient'] as const
export type EnvelopeRole = (typeof ENVELOPE_ROLES)[number]

export const ENVELOPE_ROLE_LABELLED = [
  { key: 'sender', label: 'Sender' },
  { key: 'recipient', label: 'Recipient' },
] as const
export type EnvelopeRoleLabel = (typeof ENVELOPE_ROLE_LABELLED)[number]['label']

export const ADDRESS_FIELDS_LABELLED = [
  { key: 'name', label: 'Name' },
  { key: 'street', label: 'Street' },
  { key: 'city', label: 'City' },
  { key: 'zip', label: 'Zip' },
  { key: 'country', label: 'Country' },
] as const

export type AddressField = (typeof ADDRESS_FIELDS_LABELLED)[number]['key']
export type AddressFieldLabel =
  (typeof ADDRESS_FIELDS_LABELLED)[number]['label']

export type AddressFields = Record<AddressField, string>
