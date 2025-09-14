import type { EnvelopeUiState } from '../types/ui.types'

export const initialEnvelopeUiState: EnvelopeUiState = {
  miniAddressClose: null,
  envelopeSave: null,
  envelopeSaveSecond: null,
  envelopeRemoveAddress: null,
  envelopeButtons: {
    sender: { save: false, delete: false, clip: false },
    recipient: { save: false, delete: false, clip: false },
  },
}
