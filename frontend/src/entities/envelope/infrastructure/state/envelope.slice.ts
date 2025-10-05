import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EnvelopeState } from '../../domain/types'

const initialState: EnvelopeState = {
  sender: { street: '', zip: '', city: '', country: '', name: '' },
  recipient: { street: '', zip: '', city: '', country: '', name: '' },
  ui: {
    miniAddressClose: null,
    envelopeSave: null,
    envelopeSaveSecond: null,
    envelopeRemoveAddress: null,
  },
}

const envelopeSlice = createSlice({
  name: 'envelope',
  initialState,
  reducers: {
    setSender(state, action: PayloadAction<Partial<EnvelopeState['sender']>>) {
      state.sender = { ...state.sender, ...action.payload }
    },
    setRecipient(
      state,
      action: PayloadAction<Partial<EnvelopeState['recipient']>>
    ) {
      state.recipient = { ...state.recipient, ...action.payload }
    },
    setEnvelopeUi(state, action: PayloadAction<Partial<EnvelopeState['ui']>>) {
      state.ui = { ...state.ui, ...action.payload }
    },
  },
})

export const { setSender, setRecipient, setEnvelopeUi } = envelopeSlice.actions
export default envelopeSlice.reducer
