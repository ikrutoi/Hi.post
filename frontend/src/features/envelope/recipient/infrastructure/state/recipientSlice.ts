import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type { RecipientState } from '@envelope/domain/types'

export const initialRecipient: RecipientState = {
  ...initialSection,
  enabled: false,
  applied: false,
}

const recipientSlice = createSlice({
  name: 'recipient',
  initialState: initialRecipient,
  reducers: {
    updateRecipientField: (
      state,
      action: PayloadAction<{ field: keyof AddressFields; value: string }>,
    ) => {
      state.data[action.payload.field] = action.payload.value
      state.isComplete = Object.values(state.data).every(
        (val) => val.trim() !== '',
      )
      state.applied = false
    },

    restoreRecipient: (state, action: PayloadAction<RecipientState>) => {
      return {
        ...action.payload,
        enabled: false,
        applied: action.payload.applied ?? false,
      }
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
    },

    clearRecipient: () => initialRecipient,

    setRecipientApplied: (state, action: PayloadAction<boolean>) => {
      state.applied = action.payload
    },

    saveAddressRequested: () => {},
  },
})

export const {
  updateRecipientField,
  setEnabled,
  restoreRecipient,
  clearRecipient,
  setRecipientApplied,
  saveAddressRequested,
} = recipientSlice.actions
export default recipientSlice.reducer
