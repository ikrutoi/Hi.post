import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CardphotoUiState {
  shouldOpenFileDialog: boolean
  isLoading: boolean
  needsCrop: boolean
}

const initialUiState: CardphotoUiState = {
  shouldOpenFileDialog: false,
  isLoading: false,
  needsCrop: false,
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
  },
})

export const {
  openFileDialog,
  resetFileDialog,
  cancelFileDialog,
  markLoading,
  markLoaded,
  setNeedsCrop,
} = cardphotoUiSlice.actions

export default cardphotoUiSlice.reducer
