import { RootState } from '@app/store/store'
import type {
  EnvelopeAddresses,
  AddressRole,
  Address,
} from '@features/envelope/types'

export const selectEnvelopeAddresses = (state: RootState): EnvelopeAddresses =>
  state.envelope.addresses

export const selectAddressByRole =
  (role: AddressRole) =>
  (state: RootState): Address =>
    state.envelope.addresses[role]

export const selectSenderAddress = (state: RootState): Address =>
  state.envelope.addresses.sender

export const selectRecipientAddress = (state: RootState): Address =>
  state.envelope.addresses.recipient

export const selectEnvelopeLoading = (state: RootState): boolean =>
  state.envelope.loading

export const selectEnvelopeError = (state: RootState): string | null =>
  state.envelope.error
