import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface EnvelopeSelectionState {
  selectedRecipientIds: string[]
  recipientListPanelOpen: boolean
}

const initialState: EnvelopeSelectionState = {
  selectedRecipientIds: [],
  recipientListPanelOpen: false,
}

export const envelopeSelectionSlice = createSlice({
  name: 'envelopeSelection',
  initialState,
  reducers: {
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
  },
})

export const {
  toggleRecipientSelection,
  setSelectedRecipientIds,
  clearRecipientSelection,
  toggleRecipientListPanel,
  closeRecipientListPanel,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
