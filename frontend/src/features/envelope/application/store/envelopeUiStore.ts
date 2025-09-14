import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  EnvelopeUiSignals,
  EnvelopeButtonsState,
} from '../../domain/types/ui.types'

export interface EnvelopeUiState extends EnvelopeUiSignals {
  envelopeButtons: EnvelopeButtonsState
}

const initialState: EnvelopeUiState = {
  miniAddressClose: null,
  envelopeSave: null,
  envelopeSaveSecond: null,
  envelopeRemoveAddress: null,
  envelopeButtons: {
    sender: { save: false, delete: false, clip: false },
    recipient: { save: false, delete: false, clip: false },
  },
}

const envelopeUiSlice = createSlice({
  name: 'envelopeUi',
  initialState,
  reducers: {
    updateEnvelopeUiState: (
      state,
      action: PayloadAction<Partial<EnvelopeUiSignals>>
    ) => {
      Object.assign(state, action.payload)
    },
    updateEnvelopeButtons: (
      state,
      action: PayloadAction<Partial<EnvelopeButtonsState>>
    ) => {
      Object.assign(state.envelopeButtons, action.payload)
    },
  },
})

export const { updateEnvelopeUiState, updateEnvelopeButtons } =
  envelopeUiSlice.actions
export default envelopeUiSlice.reducer
