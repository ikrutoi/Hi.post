import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  WorkingConfig,
  CardphotoState,
  CardphotoOperation,
  CardphotoBase,
  ImageLayer,
  CropLayer,
  CardLayer,
  ImageSource,
} from '../../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

export interface CardphotoSliceState {
  state: CardphotoState
  isComplete: boolean
}

const initialState: CardphotoSliceState = {
  state: {
    base: {
      stock: { image: null },
      user: { image: null },
      apply: { image: null },
      processed: { image: null },
    },
    operations: [],
    activeIndex: -1,
    cropCount: 0,
    cropIds: [],
    activeSource: null,
    currentConfig: null,
  },
  isComplete: false,
}

export const cardphotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    initCardphoto() {},

    uploadImageReady(state, action: PayloadAction<ImageMeta>) {},

    resetCardphoto: () => initialState,

    hydrateEditor(
      state,
      action: PayloadAction<{
        base: CardphotoBase
        config: WorkingConfig
        activeSource: ImageSource
        cropIds: string[]
        cropCount: number
      }>,
    ) {
      const { base, config, activeSource, cropIds, cropCount } = action.payload

      const initialOperation: CardphotoOperation = {
        type: 'operation',
        payload: { config, reason: 'init' },
      }

      state.state = {
        base,
        operations: [initialOperation],
        activeIndex: 0,
        cropCount,
        cropIds,
        activeSource,
        currentConfig: config,
      }
      state.isComplete = false
    },

    setBaseImage(
      state,
      action: PayloadAction<{ target: keyof CardphotoBase; image: ImageMeta }>,
    ) {
      if (!state.state) return
      const { target, image } = action.payload
      state.state.base[target].image = image
    },

    uploadUserImage(state, action: PayloadAction<ImageMeta>) {
      if (!state.state) return
      state.state.base.user.image = action.payload
    },

    addOperation(state, action: PayloadAction<CardphotoOperation>) {
      if (!state.state) return
      const op = action.payload

      state.state.currentConfig = op.payload.config

      state.state.operations = state.state.operations.slice(
        0,
        state.state.activeIndex + 1,
      )

      state.state.operations.push(op)
      const newIndex = state.state.operations.length - 1
      state.state.activeIndex = newIndex
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

    setOrientation(state, action: PayloadAction<LayoutOrientation>) {
      if (!state.state || !state.state.currentConfig) return

      const newConfig: WorkingConfig = {
        ...state.state.currentConfig,
        card: {
          ...state.state.currentConfig.card,
          orientation: action.payload,
        },
      }

      const op: CardphotoOperation = {
        type: 'operation',
        payload: {
          config: newConfig,
          reason: 'rotateCard',
        },
      }

      state.state.operations = state.state.operations.slice(
        0,
        state.state.activeIndex + 1,
      )
      state.state.operations.push(op)
      state.state.activeIndex = state.state.operations.length - 1
      state.state.currentConfig = newConfig
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

    cancelSelection: () => initialState,

    resetCropLayers(
      state,
      action: PayloadAction<{
        imageLayer: ImageLayer
        cropLayer: CropLayer
        card: CardLayer
      }>,
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

    setActiveSource(state, action: PayloadAction<ImageSource>) {
      if (state.state) {
        state.state.activeSource = action.payload
      }
    },

    addCropId(state, action: PayloadAction<string>) {
      if (state.state) {
        if (!state.state.cropIds) state.state.cropIds = []
        if (!state.state.cropIds.includes(action.payload)) {
          state.state.cropIds.push(action.payload)
          state.state.cropCount = state.state.cropIds.length
        }
      }
    },

    setProcessedImage(state, action: PayloadAction<ImageMeta>) {
      if (state.state) {
        state.state.base.processed.image = action.payload
        state.state.activeSource = 'processed'
      }
    },

    removeCropId1(state, action: PayloadAction<string>) {
      if (state.state && state.state.cropIds) {
        state.state.cropIds = state.state.cropIds.filter(
          (id) => id !== action.payload,
        )
        state.state.cropCount = state.state.cropIds.length

        if (state.state.base.processed.image?.id === action.payload) {
          state.state.base.processed.image = null
          state.state.activeSource = 'user'
        }
      }
    },

    removeCropId(state, action: PayloadAction<string>) {
      const cp = state.state
      if (!cp || !cp.cropIds) return

      const deletedId = action.payload
      const isDeletingActive = cp.base.processed.image?.id === deletedId

      let nextActiveId: string | null = null
      if (isDeletingActive) {
        const currentIndex = cp.cropIds.indexOf(deletedId)
        if (cp.cropIds.length > 1) {
          const nextIndex =
            currentIndex < cp.cropIds.length - 1
              ? currentIndex + 1
              : currentIndex - 1
          nextActiveId = cp.cropIds[nextIndex]
        }
      }

      cp.cropIds = cp.cropIds.filter((id) => id !== deletedId)
      cp.cropCount = cp.cropIds.length

      if (isDeletingActive) {
        if (nextActiveId) {
          cp.base.processed.image = null
        } else {
          cp.base.processed.image = null
          cp.activeSource = cp.base.user.image ? 'user' : 'stock'
        }
      }
    },

    clearAllCrops(state) {
      if (state.state) {
        state.state.cropIds = []
        state.state.cropCount = 0

        if (state.state.activeSource === 'processed') {
          state.state.activeSource = 'user'
          state.state.base.processed.image = null
        }
      }
    },

    removeUserImage(state) {
      const cp = state.state
      if (!cp) return

      cp.base.user.image = null

      if (cp.activeSource === 'user') {
        if (cp.base.processed.image) {
          cp.activeSource = 'processed'
        } else {
          cp.activeSource = 'stock'
        }
      }
    },
  },
})

export const {
  initCardphoto,
  uploadImageReady,
  resetCardphoto,
  setBaseImage,
  uploadUserImage,
  addOperation,
  undo,
  redo,
  setOrientation,
  applyFinal,
  reset,
  cancelSelection,
  resetCropLayers,
  setActiveSource,
  addCropId,
  setProcessedImage,
  hydrateEditor,
  removeCropId,
  clearAllCrops,
  removeUserImage,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
