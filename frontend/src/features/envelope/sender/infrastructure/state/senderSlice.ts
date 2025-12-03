import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressFields } from '@shared/config/constants'
import type { SenderState } from '@envelope/domain/types'

export const initialSender: SenderState = {
  data: {
    name: '',
    street: '',
    zip: '',
    city: '',
    country: '',
  },
  isComplete: false,
  enabled: true,
}

const senderSlice = createSlice({
  name: 'sender',
  initialState: initialSender,
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

    toggleEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
      if (!action.payload) {
        state.isComplete = true
      }
    },

    clearSender: () => initialSender,
  },
})

export const { updateField, setComplete, toggleEnabled, clearSender } =
  senderSlice.actions
export default senderSlice.reducer
