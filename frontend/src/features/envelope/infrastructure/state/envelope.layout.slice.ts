import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialAddressFields } from '@envelope/domain/models'
import type { AddressFields, EnvelopeRole } from '@shared/config/constants'

export interface EnvelopeState {
  sender: AddressFields
  recipient: AddressFields
}

const initialState: EnvelopeState = {
  sender: { ...initialAddressFields },
  recipient: { ...initialAddressFields },
}

const envelopeSlice = createSlice({
  name: 'envelope',
  initialState,
  reducers: {
    setEnvelope(state, action: PayloadAction<EnvelopeState>) {
      state.sender = action.payload.sender
      state.recipient = action.payload.recipient
    },
    updateAddressField(
      state,
      action: PayloadAction<{
        role: EnvelopeRole
        field: keyof AddressFields
        value: string
      }>
    ) {
      const { role, field, value } = action.payload
      state[role][field] = value
    },
    resetEnvelope(state, action: PayloadAction<EnvelopeRole | undefined>) {
      const role = action.payload

      if (role === 'sender' || role === 'recipient') {
        state[role] = { ...initialAddressFields }
      } else {
        state.sender = { ...initialAddressFields }
        state.recipient = { ...initialAddressFields }
      }
    },
  },
})

export const { setEnvelope, updateAddressField, resetEnvelope } =
  envelopeSlice.actions

export default envelopeSlice.reducer
