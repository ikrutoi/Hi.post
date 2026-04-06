import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type CardphotoListTemplateGridCols = 4 | 5 | 6 | 7

export interface CardphotoUiState {
  shouldOpenFileDialog: boolean
  isLoading: boolean
  needsCrop: boolean
  isListPanelOpen: boolean
  inlineTemplateListRevision: number
  listTemplateGridCols: CardphotoListTemplateGridCols
}

const initialUiState: CardphotoUiState = {
  shouldOpenFileDialog: false,
  isLoading: false,
  needsCrop: false,
  isListPanelOpen: false,
  inlineTemplateListRevision: 0,
  listTemplateGridCols: 5,
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

    cycleListTemplateGridCols(state) {
      const order: CardphotoListTemplateGridCols[] = [4, 5, 6, 7]
      const i = order.indexOf(state.listTemplateGridCols)
      const next = order[(i >= 0 ? i + 1 : 1) % order.length]
      state.listTemplateGridCols = next
    },

    setListTemplateGridCols(
      state,
      action: PayloadAction<CardphotoListTemplateGridCols>,
    ) {
      state.listTemplateGridCols = action.payload
    },

    selectInLineTemplate: (_state, _action: PayloadAction<string>) => {},
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
  cycleListTemplateGridCols,
  setListTemplateGridCols,
  selectInLineTemplate,
} = cardphotoUiSlice.actions

export default cardphotoUiSlice.reducer
