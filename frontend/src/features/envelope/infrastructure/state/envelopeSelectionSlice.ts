import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type AddressDraft = Record<string, string> | null

export interface EnvelopeSelectionState {
  recipientsPendingIds: string[]
  recipientListPanelOpen: boolean
  senderListPanelOpen: boolean
  senderViewEditMode: boolean
  recipientViewEditMode: boolean
  senderDraft: AddressDraft
  recipientDraft: AddressDraft
  showAddressFormView: boolean
  addressFormViewRole: 'sender' | 'recipient' | null
}

const initialState: EnvelopeSelectionState = {
  recipientsPendingIds: [],
  recipientListPanelOpen: false,
  senderListPanelOpen: false,
  senderViewEditMode: false,
  recipientViewEditMode: false,
  senderDraft: null,
  recipientDraft: null,
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

    toggleRecipientListPanel(state) {
      state.recipientListPanelOpen = !state.recipientListPanelOpen
    },

    closeRecipientListPanel(state) {
      state.recipientListPanelOpen = false
    },

    toggleSenderListPanel(state) {
      state.senderListPanelOpen = !state.senderListPanelOpen
    },

    closeSenderListPanel(state) {
      state.senderListPanelOpen = false
    },

    setSenderViewEditMode(state, action: PayloadAction<boolean>) {
      state.senderViewEditMode = action.payload
    },

    setRecipientViewEditMode(state, action: PayloadAction<boolean>) {
      state.recipientViewEditMode = action.payload
    },

    setSenderDraft(state, action: PayloadAction<AddressDraft>) {
      state.senderDraft = action.payload
    },

    setRecipientDraft(state, action: PayloadAction<AddressDraft>) {
      state.recipientDraft = action.payload
    },

    clearSenderDraft(state) {
      state.senderDraft = null
    },

    clearRecipientDraft(state) {
      state.recipientDraft = null
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
  toggleRecipientListPanel,
  closeRecipientListPanel,
  toggleSenderListPanel,
  closeSenderListPanel,
  setSenderViewEditMode,
  setRecipientViewEditMode,
  setSenderDraft,
  setRecipientDraft,
  clearSenderDraft,
  clearRecipientDraft,
  setAddressFormView,
  addressSaveSuccess,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
