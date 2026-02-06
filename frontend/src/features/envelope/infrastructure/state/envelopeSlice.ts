import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ADDRESS_FIELD_ORDER } from '@shared/config/constants'
import type {
  SenderState,
  RecipientState,
  EnvelopeSessionRecord,
} from '../../domain/types'
import type {
  EnvelopeRole,
  AddressFields,
  AddressField,
} from '@shared/config/constants'

const initialAddress: AddressFields = {
  name: '',
  street: '',
  city: '',
  zip: '',
  country: '',
}

const initialState: {
  sender: SenderState
  recipient: RecipientState
} = {
  sender: {
    data: { ...initialAddress },
    isComplete: false,
    enabled: false,
  },
  recipient: {
    data: { ...initialAddress },
    isComplete: false,
  },
}

const envelopeSlice = createSlice({
  name: 'envelope',
  initialState,
  reducers: {
    updateAddressField: (
      state,
      action: PayloadAction<{
        role: EnvelopeRole
        field: AddressField
        value: string
      }>,
    ) => {
      const { role, field, value } = action.payload
      state[role].data[field] = value

      const allFieldsFilled = ADDRESS_FIELD_ORDER.every(
        (f) => state[role].data[f].trim().length > 0,
      )
      state[role].isComplete = allFieldsFilled
    },

    toggleSender: (state, action: PayloadAction<boolean>) => {
      state.sender.enabled = action.payload
    },

    restoreEnvelopeSession: (
      state,
      action: PayloadAction<EnvelopeSessionRecord>,
    ) => {
      return { ...state, ...action.payload }
    },

    clearEnvelope: () => initialState,

    clearRole: (state, action: PayloadAction<EnvelopeRole>) => {
      const role = action.payload

      state[role].data = { ...initialAddress }

      state[role].isComplete = false
    },
  },
})

export const {
  updateAddressField,
  toggleSender,
  restoreEnvelopeSession,
  clearEnvelope,
  clearRole,
} = envelopeSlice.actions

export default envelopeSlice.reducer
