import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RecipientMode } from '../../domain/types'

export interface EnvelopeSelectionState {
  selectedRecipientIds: string[]
  recipientListPanelOpen: boolean
  /** Режим получателей: на каком остановился пользователь (для отображения в секции Конверт) */
  recipientMode: RecipientMode
}

const initialState: EnvelopeSelectionState = {
  selectedRecipientIds: [],
  recipientListPanelOpen: false,
  recipientMode: 'single',
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
  },
})

export const {
  setRecipientMode,
  toggleRecipientSelection,
  setSelectedRecipientIds,
  clearRecipientSelection,
  toggleRecipientListPanel,
  closeRecipientListPanel,
} = envelopeSelectionSlice.actions

export default envelopeSelectionSlice.reducer
