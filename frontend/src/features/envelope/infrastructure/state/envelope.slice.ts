import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { EnvelopeRole } from '@shared/config/constants'
import type { EnvelopeState, RoleState } from '../../domain/types'

const initialSection: RoleState = {
  data: {
    name: '',
    street: '',
    zip: '',
    city: '',
    country: '',
  },
  isComplete: false,
}

const initialState: EnvelopeState = {
  sender: { ...initialSection },
  recipient: { ...initialSection },
  isComplete: false,
}

export const envelopeSlice = createSlice({
  name: 'envelope',
  initialState,
  reducers: {
    updateRole: (
      state,
      action: PayloadAction<{ role: EnvelopeRole; data: RoleState }>
    ) => {
      const { role, data } = action.payload
      state[role] = data
      state.isComplete = state.recipient.isComplete
    },
    clearRole: (state, action: PayloadAction<EnvelopeRole>) => {
      const role = action.payload
      state[role] = { ...initialSection }
      state.isComplete = state.recipient.isComplete
    },
    resetEnvelope: () => initialState,
  },
})

export const { updateRole, clearRole, resetEnvelope } = envelopeSlice.actions
export default envelopeSlice.reducer
