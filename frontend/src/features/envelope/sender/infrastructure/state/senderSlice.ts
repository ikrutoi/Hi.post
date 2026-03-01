import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { initialSection } from '../../../addressForm/domain/models'
import type { AddressFields } from '@shared/config/constants'
import type { SenderState, SenderView } from '../../domain/types'

export const initialSender: SenderState = {
  currentView: 'addressFormSenderView',
  addressFormData: { ...initialSection.data },
  addressFormIsComplete: false,
  senderViewId: null,
  previousSenderViewId: null,
  applied: [],
  enabled: true,
}

function isComplete(data: AddressFields): boolean {
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
      state.addressFormData[action.payload.field] = action.payload.value
      state.addressFormIsComplete = isComplete(state.addressFormData)
    },

    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
    },

    restoreSender: (state, action: PayloadAction<Partial<SenderState>>) => {
      return {
        ...initialSender,
        ...action.payload,
      }
    },

    clearSender: () => initialSender,

    setSenderAppliedIds: (state, action: PayloadAction<string[]>) => {
      state.applied = action.payload
    },

    setSenderApplied: (state, action: PayloadAction<boolean>) => {
      if (!action.payload) state.applied = []
    },

    setSenderView: (state, action: PayloadAction<SenderView>) => {
      state.currentView = action.payload
    },

    setSenderViewId: (state, action: PayloadAction<string | null>) => {
      state.senderViewId = action.payload
    },

    setPreviousSenderViewId: (state, action: PayloadAction<string | null>) => {
      state.previousSenderViewId = action.payload
    },

    saveAddressRequested: () => {},
  },
})

export const {
  updateSenderField,
  setEnabled,
  restoreSender,
  clearSender,
  setSenderAppliedIds,
  setSenderApplied,
  setSenderView,
  setSenderViewId,
  setPreviousSenderViewId,
  saveAddressRequested,
} = senderSlice.actions
export default senderSlice.reducer
