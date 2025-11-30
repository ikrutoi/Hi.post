import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressFields, EnvelopeRole } from '@shared/config/constants'
import { RoleState, EnvelopeState } from '../../../domain/types'

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

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{
        role: EnvelopeRole
        field: keyof AddressFields
        value: string
      }>
    ) => {
      const { role, field, value } = action.payload
      state[role].data[field] = value
    },
    setComplete: (
      state,
      action: PayloadAction<{ role: EnvelopeRole; isComplete: boolean }>
    ) => {
      const { role, isComplete } = action.payload
      state[role].isComplete = isComplete
    },
    clearRole: (state, action: PayloadAction<EnvelopeRole>) => {
      const role = action.payload
      state[role] = { ...initialSection }
    },
  },
})

export const { updateField, setComplete, clearRole } = addressSlice.actions
export default addressSlice.reducer
