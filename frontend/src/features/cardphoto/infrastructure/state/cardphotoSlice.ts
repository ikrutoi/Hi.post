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
      const meta = action.payload

      state.activeImage = meta
      state.history = {
        original: {
          id: meta.id,
          source: meta.source,
          url: meta.url,
        },
        operations: [
          {
            type: 'initial',
          },
        ],
        activeIndex: 0,
      }
      state.isComplete = false
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
  cancelSelection,
  uploadImage,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
