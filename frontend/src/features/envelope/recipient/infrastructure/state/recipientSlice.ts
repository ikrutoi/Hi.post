import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import type { RecipientState } from '@envelope/domain/types'

export const initialRecipient: RecipientState = {
  data: {
    name: '',
    street: '',
    zip: '',
    city: '',
    country: '',
  },
  isComplete: false,
}

const recipientSlice = createSlice({
  name: 'recipient',
  initialState: initialRecipient,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof AddressFields; value: string }>
    ) => {
      state.data[action.payload.field] = action.payload.value
    },

    setComplete: (state, action: PayloadAction<boolean>) => {
      state.isComplete = action.payload
    },

    clearRecipient: () => initialRecipient,
  },
})

export const { updateField, setComplete, clearRecipient } =
  recipientSlice.actions
export default recipientSlice.reducer
