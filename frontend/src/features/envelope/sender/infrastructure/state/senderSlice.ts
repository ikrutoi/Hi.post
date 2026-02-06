import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type { SenderState } from '@envelope/domain/types'

export const initialSender: SenderState = {
  ...initialSection,
  enabled: true,
}

function recomputeComplete(data: AddressFields): boolean {
  return Object.values(data).every((val) => val.trim() !== '')
}

const senderSlice = createSlice({
  name: 'sender',
  initialState: initialSender,
  reducers: {
    updateSenderField: (
      state,
      action: PayloadAction<{ field: keyof AddressFields; value: string }>,
    ) => {
      state.data[action.payload.field] = action.payload.value
      state.isComplete = recomputeComplete(state.data)
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
    },

    restoreSender: (state, action: PayloadAction<SenderState>) => {
      return action.payload
    },

    clearSender: () => initialSender,
  },
})

export const { updateSenderField, setEnabled, restoreSender, clearSender } =
  senderSlice.actions
export default senderSlice.reducer
