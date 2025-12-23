import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  ImageOperation,
  ImageHistory,
  ImageOriginal,
} from '../../domain/types'

export interface CardphotoState {
  activeImage: ImageMeta | null
  history: ImageHistory | null
  isComplete: boolean
}

const initialState: CardphotoState = {
  activeImage: null,
  history: null,
  isComplete: false,
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
        },
        operations: [],
        activeIndex: -1,
      }
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
    },

    markComplete(state) {
      state.isComplete = true
    },

    cancelSelection(state) {
      state.activeImage = null
      state.history = null
      state.isComplete = false
    },
  },
})

export const {
  setActiveImage,
  addOperation,
  undo,
  redo,
  reset,
  markComplete,
  cancelSelection,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
