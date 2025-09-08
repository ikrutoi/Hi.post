import type { AddressRole } from '@envelope/domain'

export type ToggleSet = {
  save: boolean
  delete: boolean
  clip: boolean
}

export type EnvelopeButtonsState = Record<AddressRole, ToggleSet>

export interface EnvelopeUiSignals {
  miniAddressClose: AddressRole | null
  envelopeSave: AddressRole | null
  envelopeSaveSecond: boolean | null
  envelopeRemoveAddress: boolean | null
}

export interface EnvelopeUiState extends EnvelopeUiSignals {
  envelopeButtons: EnvelopeButtonsState
}
