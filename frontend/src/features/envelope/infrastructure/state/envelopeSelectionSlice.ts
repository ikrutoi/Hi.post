import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RecipientMode } from '../../domain/types'

export type AddressDraft = Record<string, string> | null

export interface EnvelopeSelectionState {
  selectedRecipientIds: string[]
  recipientListPanelOpen: boolean
  senderListPanelOpen: boolean
  recipientMode: RecipientMode
  recipientTemplateId: string | null
  senderTemplateId: string | null
  previousRecipientTemplateId: string | null
  previousSenderTemplateId: string | null
  savedSenderAddressEditMode: boolean
  savedRecipientAddressEditMode: boolean
  senderDraft: AddressDraft
  recipientDraft: AddressDraft
  showAddressFormView: boolean
  addressFormViewRole: 'sender' | 'recipient' | null
}

const initialState: EnvelopeSelectionState = {
  selectedRecipientIds: [],
  recipientListPanelOpen: false,
  senderListPanelOpen: false,
  recipientMode: 'recipient',
  recipientTemplateId: null,
  senderTemplateId: null,
  previousRecipientTemplateId: null,
  previousSenderTemplateId: null,
  savedSenderAddressEditMode: false,
  savedRecipientAddressEditMode: false,
  senderDraft: null,
  recipientDraft: null,
  showAddressFormView: false,
  addressFormViewRole: null,
}

export const envelopeSelectionSlice = createSlice({
  name: 'envelopeSelection',
  initialState,
  reducers: {
    setRecipientMode(state, action: PayloadAction<RecipientMode>) {
      state.recipientMode = action.payload
    },

    toggleRecipientSelection(state, action: PayloadAction<string>) {
      const id = action.payload
      const idx = state.selectedRecipientIds.indexOf(id)
      if (idx === -1) {
        state.selectedRecipientIds.push(id)
      } else {
        state.selectedRecipientIds.splice(idx, 1)
      }
    },

    setSelectedRecipientIds(state, action: PayloadAction<string[]>) {
      state.selectedRecipientIds = action.payload
    },

    clearRecipientSelection(state) {
      state.selectedRecipientIds = []
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

    setRecipientTemplateId(state, action: PayloadAction<string | null>) {
      state.recipientTemplateId = action.payload
    },

    setSenderTemplateId(state, action: PayloadAction<string | null>) {
      state.senderTemplateId = action.payload
    },

    setSenderSavedAddressEditMode(state, action: PayloadAction<boolean>) {
      state.savedSenderAddressEditMode = action.payload
    },

    setRecipientSavedAddressEditMode(state, action: PayloadAction<boolean>) {
      state.savedRecipientAddressEditMode = action.payload
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
      const { show, role } = action.payload
      if (show && role === 'recipient') {
        state.previousRecipientTemplateId = state.recipientTemplateId
      }
      if (show && role === 'sender') {
        state.previousSenderTemplateId = state.senderTemplateId
      }
      if (!show) {
        const closingRole = state.addressFormViewRole
        if (
          closingRole === 'recipient' &&
          state.previousRecipientTemplateId != null
        ) {
          state.recipientTemplateId = state.previousRecipientTemplateId
          state.previousRecipientTemplateId = null
        }
        if (
          closingRole === 'sender' &&
          state.previousSenderTemplateId != null
        ) {
          state.senderTemplateId = state.previousSenderTemplateId
          state.previousSenderTemplateId = null
        }
      }
      state.showAddressFormView = action.payload.show
      state.addressFormViewRole = action.payload.role
    },

    addressSaveSuccess(state, action: PayloadAction<'sender' | 'recipient'>) {
      if (action.payload === 'recipient')
        state.previousRecipientTemplateId = null
      else state.previousSenderTemplateId = null
    },
  },
})

export const {
  setRecipientMode,
  toggleRecipientSelection,
  setSelectedRecipientIds,
  clearRecipientSelection,
  toggleRecipientListPanel,
  closeRecipientListPanel,
  toggleSenderListPanel,
  closeSenderListPanel,
  setRecipientTemplateId,
  setSenderTemplateId,
  setSenderSavedAddressEditMode,
  setRecipientSavedAddressEditMode,
  setSenderDraft,
  setRecipientDraft,
  clearSenderDraft,
  clearRecipientDraft,
  setAddressFormView,
  addressSaveSuccess,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
