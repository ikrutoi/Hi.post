import type { IconKey, IconState } from '@shared/config/constants'
import type { BaseSectionConfig } from './toolbar.types'

export const ENVELOPE_KEYS = [
  'save',
  'remove',
  'cardUser',
] as const satisfies readonly IconKey[]

export type EnvelopeKey = (typeof ENVELOPE_KEYS)[number]

export type AddressState = {
  save: IconState
  remove: IconState
  cardUser: IconState
}

const initialAddressState: AddressState = {
  save: 'disabled',
  remove: 'disabled',
  cardUser: 'disabled',
}

export const initialSenderToolbarState: AddressState = {
  ...initialAddressState,
}

export const initialRecipientToolbarState: AddressState = {
  ...initialAddressState,
}

export interface EnvelopeSectionConfig
  extends BaseSectionConfig<
    AddressState,
    EnvelopeKey,
    'sender' | 'recipient'
  > {}
