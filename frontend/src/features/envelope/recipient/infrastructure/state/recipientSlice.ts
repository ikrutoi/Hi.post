import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type { RecipientState } from '@envelope/domain/types'

export const initialRecipient: RecipientState = {
  ...initialSection,
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
      return action.payload
    },

    clearRecipient: () => initialRecipient,
  },
})

export const { updateRecipientField, restoreRecipient, clearRecipient } =
  recipientSlice.actions
export default recipientSlice.reducer
