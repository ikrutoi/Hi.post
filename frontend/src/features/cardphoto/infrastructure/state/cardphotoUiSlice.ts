import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  CardphotoListSortMode,
  CardphotoListTitleCoverage,
} from '../../application/helpers/cardphotoListSort'
import type { ImageMeta, WorkingConfig } from '../../domain/types'

export type CardphotoListTemplateGridCols = 4 | 5 | 6 | 7

/** View slot to restore after closing create opened from cardphotoAdd reminder. */
export interface CardphotoViewReturnSnapshot {
  assetData: ImageMeta
  assetConfig: WorkingConfig
}

export interface CardphotoUiState {
  shouldOpenFileDialog: boolean
  isLoading: boolean
  needsCrop: boolean
  isListPanelOpen: boolean
  inlineTemplateListRevision: number
  listTemplateGridCols: CardphotoListTemplateGridCols
  listSortMode: CardphotoListSortMode
  listTitleCoverage: CardphotoListTitleCoverage
  /** inLine / view preview → crop toolbar (`cardphotoCreate`) */
  isCardphotoViewEditMode: boolean
  viewReturnSnapshot: CardphotoViewReturnSnapshot | null
}

const initialUiState: CardphotoUiState = {
  shouldOpenFileDialog: false,
  isLoading: false,
  needsCrop: false,
  isListPanelOpen: false,
  inlineTemplateListRevision: 0,
  listTemplateGridCols: 5,
  listSortMode: 'dateDesc',
  listTitleCoverage: 'none',
  isCardphotoViewEditMode: false,
  viewReturnSnapshot: null,
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

    setCardphotoListSortMode(state, action: PayloadAction<CardphotoListSortMode>) {
      state.listSortMode = action.payload
    },

    setCardphotoListTitleCoverage(
      state,
      action: PayloadAction<CardphotoListTitleCoverage>,
    ) {
      state.listTitleCoverage = action.payload
    },

    selectInLineTemplate: (_state, _action: PayloadAction<string>) => {},

    setCardphotoViewEditMode(state, action: PayloadAction<boolean>) {
      state.isCardphotoViewEditMode = action.payload
    },

    setCardphotoViewReturnSnapshot(
      state,
      action: PayloadAction<CardphotoViewReturnSnapshot | null>,
    ) {
      state.viewReturnSnapshot = action.payload
    },

    clearCardphotoViewReturnSnapshot(state) {
      state.viewReturnSnapshot = null
    },

    closeCardphotoViewRequested(_state) {},
    editCardphotoViewRequested(_state) {},
    deleteCardphotoFromViewRequested(_state) {},
    openCardphotoFromMiniStripRequested(_state) {},
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
  setCardphotoListSortMode,
  setCardphotoListTitleCoverage,
  selectInLineTemplate,
  setCardphotoViewEditMode,
  setCardphotoViewReturnSnapshot,
  clearCardphotoViewReturnSnapshot,
  closeCardphotoViewRequested,
  editCardphotoViewRequested,
  deleteCardphotoFromViewRequested,
  openCardphotoFromMiniStripRequested,
} = cardphotoUiSlice.actions

export default cardphotoUiSlice.reducer
