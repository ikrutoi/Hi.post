import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialAddress } from '@envelope/domain/models'
import type { Address, AddressRole } from '@envelope/domain/types'

export interface EnvelopeState {
  sender: Address
  recipient: Address
}

const initialState: EnvelopeState = {
  sender: { ...initialAddress },
  recipient: { ...initialAddress },
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
        role: AddressRole
        field: keyof Address
        value: string
      }>
    ) {
      const { role, field, value } = action.payload
      state[role][field] = value
    },
    resetEnvelope(state) {
      state.sender = { ...initialAddress }
      state.recipient = { ...initialAddress }
    },
  },
})

export const { setEnvelope, updateAddressField, resetEnvelope } =
  envelopeSlice.actions

export default envelopeSlice.reducer
