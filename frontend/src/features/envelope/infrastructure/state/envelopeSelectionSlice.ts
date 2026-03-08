import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AddressBookMode } from '../../addressBook/domain/types'

export interface EnvelopeSelectionState {
  recipientsPendingIds: string[]
  activeAddressList: AddressBookMode | null
  recipientListPanelOpen: boolean
  senderListPanelOpen: boolean
  senderViewEditMode: boolean
  recipientViewEditMode: boolean
  showAddressFormView: boolean
  addressFormViewRole: 'sender' | 'recipient' | null
}

const initialState: EnvelopeSelectionState = {
  recipientsPendingIds: [],
  activeAddressList: null,
  recipientListPanelOpen: false,
  senderListPanelOpen: false,
  senderViewEditMode: false,
  recipientViewEditMode: false,
  showAddressFormView: false,
  addressFormViewRole: null,
}

export const envelopeSelectionSlice = createSlice({
  name: 'envelopeSelection',
  initialState,
  reducers: {
    toggleRecipientSelection(state, action: PayloadAction<string>) {
      const id = action.payload
      const idx = state.recipientsPendingIds.indexOf(id)
      if (idx === -1) {
        state.recipientsPendingIds.push(id)
      } else {
        state.recipientsPendingIds.splice(idx, 1)
      }
    },

    setRecipientsPendingIds(state, action: PayloadAction<string[]>) {
      state.recipientsPendingIds = action.payload
    },

    clearRecipientsPending(state) {
      state.recipientsPendingIds = []
    },

    setActiveAddressList(state, action: PayloadAction<AddressBookMode | null>) {
      const mode = action.payload
      state.activeAddressList = mode
      state.senderListPanelOpen = mode === 'sender'
      state.recipientListPanelOpen =
        mode === 'recipient' || mode === 'recipients'
    },

    closeAddressList(state) {
      state.activeAddressList = null
      state.senderListPanelOpen = false
      state.recipientListPanelOpen = false
    },

    setSenderViewEditMode(state, action: PayloadAction<boolean>) {
      state.senderViewEditMode = action.payload
    },

    setRecipientViewEditMode(state, action: PayloadAction<boolean>) {
      state.recipientViewEditMode = action.payload
    },

    setAddressFormView(
      state,
      action: PayloadAction<{
        show: boolean
        role: 'sender' | 'recipient' | null
      }>,
    ) {
      state.showAddressFormView = action.payload.show
      state.addressFormViewRole = action.payload.role
    },

    addressSaveSuccess() {},
  },
})

export const {
  toggleRecipientSelection,
  setRecipientsPendingIds,
  clearRecipientsPending,
  setActiveAddressList,
  closeAddressList,
  setSenderViewEditMode,
  setRecipientViewEditMode,
  setAddressFormView,
  addressSaveSuccess,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
