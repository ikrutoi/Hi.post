import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type { RecipientState } from '@envelope/domain/types'

export const initialRecipient: RecipientState = {
  ...initialSection,
  enabled: true,
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
    },

    restoreRecipient: (state, action: PayloadAction<RecipientState>) => {
      return {
        ...action.payload,
        enabled: action.payload.enabled ?? true,
      }
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
    },

    clearRecipient: () => initialRecipient,

    saveAddressRequested: () => {},
  },
})

export const {
  updateRecipientField,
  setEnabled,
  restoreRecipient,
  clearRecipient,
  saveAddressRequested,
} = recipientSlice.actions
export default recipientSlice.reducer
