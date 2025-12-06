import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EnvelopeState } from '@envelope/domain/types'
import type { EnvelopeRole } from '@shared/config/constants'

const initialState: EnvelopeState = {
  sender: { isComplete: false },
  recipient: { isComplete: false },
  isComplete: false,
}

const envelopeSlice = createSlice({
  name: 'envelope',
  initialState,
  reducers: {
    setEnvelopeComplete: (state, action: PayloadAction<boolean>) => {
      state.isComplete = action.payload
    },

    recomputeEnvelope: (
      state,
      action: PayloadAction<{ sender: boolean; recipient: boolean }>
    ) => {
      state.sender.isComplete = action.payload.sender
      state.recipient.isComplete = action.payload.recipient
      state.isComplete = action.payload.sender && action.payload.recipient
    },

    clearRole: (state, action: PayloadAction<EnvelopeRole>) => {
      const role = action.payload
      if (role === 'sender') {
        state.sender.isComplete = false
      } else {
        state.recipient.isComplete = false
      }
      state.isComplete = state.sender.isComplete && state.recipient.isComplete
    },

    clearEnvelope: (state) => {
      state.sender.isComplete = false
      state.recipient.isComplete = false
      state.isComplete = false
    },
  },
})

export const {
  setEnvelopeComplete,
  recomputeEnvelope,
  clearRole,
  clearEnvelope,
} = envelopeSlice.actions

export default envelopeSlice.reducer
