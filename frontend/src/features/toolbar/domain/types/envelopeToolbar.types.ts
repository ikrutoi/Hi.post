import type { State } from '@shared/config/theme'

export const ENVELOPE_KEYS = ['save', 'delete', 'clip'] as const

export type EnvelopeToolbarKey = (typeof ENVELOPE_KEYS)[number]

type AddressState = {
  save: State
  delete: State
  clip: State
}

const initialAddressState: AddressState = {
  save: 'disabled',
  delete: 'disabled',
  clip: 'disabled',
}

export type EnvelopeToolbarState = {
  sender: AddressState
  recipient: AddressState
}

export const initialEnvelopeToolbarState: EnvelopeToolbarState = {
  sender: initialAddressState,
  recipient: initialAddressState,
}
