import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressFields, EnvelopeRole } from '@shared/config/constants'
import type {
  RoleState,
  SenderState,
  EnvelopeState,
} from '../../../domain/types'

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

const initialSender: SenderState = {
  ...initialSection,
  enabled: true,
}

const initialState: EnvelopeState = {
  sender: initialSender,
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

    toggleSenderEnabled: (state, action: PayloadAction<boolean>) => {
      state.sender.enabled = action.payload
      if (!action.payload) {
        state.sender.isComplete = true
      }
    },

    clearRole: (state, action: PayloadAction<EnvelopeRole>) => {
      const role = action.payload
      if (role === 'sender') {
        state.sender = { ...initialSender }
      } else {
        state.recipient = { ...initialSection }
      }
    },
  },
})

export const { updateField, setComplete, toggleSenderEnabled, clearRole } =
  addressSlice.actions
export default addressSlice.reducer
