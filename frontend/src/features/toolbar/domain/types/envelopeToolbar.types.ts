import type { IconKey, IconState } from '@shared/config/constants'

export const ENVELOPE_KEYS = [
  'save',
  'delete',
  'savedTemplates',
] as const satisfies readonly IconKey[]

export type EnvelopeToolbarKey = (typeof ENVELOPE_KEYS)[number]

type AddressState = {
  save: IconState
  delete: IconState
  savedTemplates: IconState
}

const initialAddressState: AddressState = {
  save: 'disabled',
  delete: 'disabled',
  savedTemplates: 'disabled',
}

export type EnvelopeToolbarState = {
  sender: AddressState
  recipient: AddressState
}

export const initialEnvelopeToolbarState: EnvelopeToolbarState = {
  sender: initialAddressState,
  recipient: initialAddressState,
}
