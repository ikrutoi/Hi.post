import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  ImageOperation,
  ImageHistory,
} from '../../domain/types'

export interface CardphotoState {
  activeImage: ImageMeta | null
  history: ImageHistory | null
  isComplete: boolean
  shouldOpenFileDialog: boolean
  isLoading: boolean
}

const initialState: CardphotoState = {
  activeImage: null,
  history: null,
  isComplete: false,
  shouldOpenFileDialog: false,
  isLoading: false,
}

export const cardphotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    setActiveImage(state, action: PayloadAction<ImageMeta>) {
      state.activeImage = action.payload
      state.history = {
        original: {
          id: action.payload.id,
          source: action.payload.source,
          url: action.payload.url,
        },
        operations: [],
        activeIndex: -1,
      }
      state.isComplete = false
      state.isLoading = false
    },

    addOperation(state, action: PayloadAction<ImageOperation>) {
      if (state.history) {
        state.history.operations = state.history.operations.slice(
          0,
          state.history.activeIndex + 1
        )
        state.history.operations.push(action.payload)
        state.history.activeIndex = state.history.operations.length - 1
      }
    },

    undo(state) {
      if (state.history && state.history.activeIndex >= 0) {
        state.history.activeIndex -= 1
      }
    },

    redo(state) {
      if (
        state.history &&
        state.history.activeIndex < state.history.operations.length - 1
      ) {
        state.history.activeIndex += 1
      }
    },

    reset(state) {
      if (state.history) {
        state.history.operations = []
        state.history.activeIndex = -1
      }
      state.isComplete = false
      state.activeImage = null
      state.isLoading = false
    },

    markComplete(state) {
      state.isComplete = true
    },

    markLoading(state) {
      state.isLoading = true
    },

    cancelSelection(state) {
      state.activeImage = null
      state.history = null
      state.isComplete = false
      state.isLoading = false
    },

    openFileDialog(state) {
      state.shouldOpenFileDialog = true
      state.isLoading = true
    },

    resetFileDialog(state) {
      state.shouldOpenFileDialog = false
    },

    uploadImage(_state, _action: PayloadAction<ImageMeta>) {},
  },
})

export const {
  setActiveImage,
  addOperation,
  undo,
  redo,
  reset,
  markComplete,
  markLoading,
  cancelSelection,
  openFileDialog,
  resetFileDialog,
  uploadImage,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
