import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type { SenderState } from '@envelope/domain/types'

export const initialSender: SenderState = {
  ...initialSection,
  enabled: true,
  applied: false,
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
      state.applied = false
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
    },

    restoreSender: (state, action: PayloadAction<SenderState>) => {
      return { ...action.payload, applied: action.payload.applied ?? false }
    },

    clearSender: () => initialSender,

    setSenderApplied: (state, action: PayloadAction<boolean>) => {
      state.applied = action.payload
    },

    /** Триггер сохранения адреса в базу шаблонов (при клике addressPlus) */
    saveAddressRequested: () => {},
  },
})

export const {
  updateSenderField,
  setEnabled,
  restoreSender,
  clearSender,
  setSenderApplied,
  saveAddressRequested,
} = senderSlice.actions
export default senderSlice.reducer
