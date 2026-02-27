import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RecipientMode } from '../../domain/types'

export interface EnvelopeSelectionState {
  selectedRecipientIds: string[]
  recipientListPanelOpen: boolean
  senderListPanelOpen: boolean
  recipientMode: RecipientMode
  recipientTemplateId: string | null
  senderTemplateId: string | null
  savedSenderAddressEditMode: boolean
  savedRecipientAddressEditMode: boolean
}

const initialState: EnvelopeSelectionState = {
  selectedRecipientIds: [],
  recipientListPanelOpen: false,
  senderListPanelOpen: false,
  recipientMode: 'recipient',
  recipientTemplateId: null,
  senderTemplateId: null,
  savedSenderAddressEditMode: false,
  savedRecipientAddressEditMode: false,
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
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
