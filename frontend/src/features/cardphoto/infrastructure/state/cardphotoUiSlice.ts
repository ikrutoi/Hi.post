import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CardphotoUiState {
  shouldOpenFileDialog: boolean
  isLoading: boolean
  needsCrop: boolean
  isListPanelOpen: boolean
  /** Инкремент при изменении списка inLine-шаблонов (панель перечитывает IndexedDB). */
  inlineTemplateListRevision: number
}

const initialUiState: CardphotoUiState = {
  shouldOpenFileDialog: false,
  isLoading: false,
  needsCrop: false,
  isListPanelOpen: false,
  inlineTemplateListRevision: 0,
}

export const cardphotoUiSlice = createSlice({
  name: 'cardphotoUi',
  initialState: initialUiState,
  reducers: {
    openFileDialog(state) {
      console.log('openFileDialog')
      state.shouldOpenFileDialog = true
    },

    resetFileDialog(state) {
      state.shouldOpenFileDialog = false
    },

    cancelFileDialog(state) {
      state.shouldOpenFileDialog = false
      state.isLoading = false
    },

    markLoading(state) {
      state.isLoading = true
    },

    markLoaded(state) {
      state.isLoading = false
    },

    setNeedsCrop(state, action: PayloadAction<boolean>) {
      state.needsCrop = action.payload
    },

    setCardphotoListPanelOpen(state, action: PayloadAction<boolean>) {
      state.isListPanelOpen = action.payload
    },

    bumpCardphotoInlineTemplateList(state) {
      state.inlineTemplateListRevision += 1
    },
  },
})

export const {
  openFileDialog,
  resetFileDialog,
  cancelFileDialog,
  markLoading,
  markLoaded,
  setNeedsCrop,
  setCardphotoListPanelOpen,
  bumpCardphotoInlineTemplateList,
} = cardphotoUiSlice.actions

export default cardphotoUiSlice.reducer
