import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  WorkingConfig,
  CardphotoState,
  CardphotoOperation,
  CardphotoBase,
  ImageLayer,
  CropLayer,
} from '../../domain/types'

export interface CardphotoSliceState {
  state: CardphotoState | null
  isComplete: boolean
}

const initialState: CardphotoSliceState = {
  state: null,
  isComplete: false,
}

export const cardphotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    initCardphoto(state) {
      state.state = null
      state.isComplete = false
    },

    initStockImage(state, action: PayloadAction<ImageMeta>) {
      const meta = action.payload
      state.state = {
        base: {
          stock: { image: meta },
          user: { image: null },
          apply: { image: null },
        },
        operations: [],
        activeIndex: -1,
        currentConfig: null,
      }
      state.isComplete = false
    },

    uploadUserImage(state, action: PayloadAction<ImageMeta>) {
      if (!state.state) return
      state.state.base.user.image = action.payload
    },

    addOperation(state, action: PayloadAction<CardphotoOperation>) {
      if (!state.state) return
      const op = action.payload

      state.state.operations = state.state.operations.slice(
        0,
        state.state.activeIndex + 1
      )

      state.state.operations.push(op)
      state.state.activeIndex = state.state.operations.length - 1

      state.state.currentConfig = op.payload.config
    },

    undo(state) {
      if (!state.state) return
      if (state.state.activeIndex <= 0) return
      state.state.activeIndex -= 1

      state.state.currentConfig =
        state.state.operations[state.state.activeIndex]?.payload.config ?? null
    },

    redo(state) {
      if (!state.state) return
      if (state.state.activeIndex >= state.state.operations.length - 1) return
      state.state.activeIndex += 1

      state.state.currentConfig =
        state.state.operations[state.state.activeIndex]?.payload.config ?? null
    },

    applyFinal(state, action: PayloadAction<ImageMeta>) {
      if (!state.state) return
      state.state.base.apply.image = action.payload
      state.isComplete = !!action.payload
    },

    reset(state) {
      if (!state.state) return
      state.state.operations = []
      state.state.activeIndex = -1
      state.state.base.apply.image = null
      state.state.currentConfig = null
      state.isComplete = false
    },

    cancelSelection(state) {
      state.state = null
      state.isComplete = false
    },

    resetCropLayers(
      state,
      action: PayloadAction<{
        imageLayer: ImageLayer
        cropLayer: CropLayer
        card: WorkingConfig['card']
      }>
    ) {
      if (!state.state) return
      const { imageLayer, cropLayer, card } = action.payload

      const workingConfig: WorkingConfig = {
        card,
        image: imageLayer,
        crop: cropLayer,
      }

      state.state.operations = []
      state.state.activeIndex = -1
      state.state.base.apply.image = null
      state.state.currentConfig = workingConfig
      state.isComplete = false
    },
  },
})

export const {
  initCardphoto,
  initStockImage,
  uploadUserImage,
  addOperation,
  undo,
  redo,
  applyFinal,
  reset,
  cancelSelection,
  resetCropLayers,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
