import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type { RecipientState } from '@envelope/domain/types'

export const initialRecipient: RecipientState = {
  ...initialSection,
  enabled: false,
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
        enabled: false, // при перезагрузке всегда выключен, чтобы не было скачка высоты (сначала меряем одиночную форму)
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
