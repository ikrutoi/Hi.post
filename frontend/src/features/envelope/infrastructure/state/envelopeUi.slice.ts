import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EnvelopeUiSignals } from '../../domain/types'

const initialState: EnvelopeUiSignals = {
  miniAddressClose: null,
  envelopeSave: null,
  envelopeSaveSecond: null,
  envelopeRemoveAddress: null,
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
  },
})

export const { updateEnvelopeUiState } = envelopeUiSlice.actions
export default envelopeUiSlice.reducer

export const envelopeUiActions = {
  updateEnvelopeUiState,
}
