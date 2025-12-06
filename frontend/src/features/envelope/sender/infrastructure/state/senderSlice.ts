import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type { SenderState } from '@envelope/domain/types'

export const initialSender: SenderState = {
  ...initialSection,
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
      state.isComplete = recomputeComplete(state)
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
      state.isComplete = recomputeComplete(state)
    },

    clearSender: () => initialSender,
  },
})

function recomputeComplete(state: SenderState): boolean {
  if (!state.enabled) {
    return true
  }
  return Object.values(state.data).every((val) => val.trim() !== '')
}

export const { updateField, setEnabled, clearSender } = senderSlice.actions
export default senderSlice.reducer
