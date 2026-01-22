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
  GalleryItem,
} from '../../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

// export interface CardphotoSliceState {
//   state: CardphotoState
//   isComplete: boolean
// }
export interface CardphotoSliceState {
  state: CardphotoState
  isComplete: boolean
  galleryItems: GalleryItem[] | null
  isGalleryLoading: boolean
}

const initialState: CardphotoSliceState = {
  state: {
    base: {
      stock: { image: null },
      user: { image: null },
      apply: { image: null },
      gallery: { image: null },
    },
    operations: [],
    activeIndex: -1,
    cropIndices: [],
    currentConfig: null,
  },
  isComplete: false,
  galleryItems: null,
  isGalleryLoading: false,
}

export const cardphotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    initCardphoto() {},

    uploadImageReady(state, action: PayloadAction<ImageMeta>) {},

    resetCardphoto: () => initialState,

    initStockImage(
      state,
      action: PayloadAction<{ meta: ImageMeta; config: WorkingConfig }>,
    ) {
      const { meta, config } = action.payload

      const initialOperation: CardphotoOperation = {
        type: 'operation',
        payload: { config, reason: 'initStock' },
      }

      state.state = {
        base: {
          stock: { image: meta },
          user: { image: null },
          apply: { image: null },
          gallery: { image: null },
        },
        operations: [initialOperation],
        activeIndex: 0,
        cropIndices: [],
        currentConfig: config,
      }
      state.isComplete = false
      // state.galleryItems = null
      // state.isGalleryLoading = false
    },

    setBaseImage(
      state,
      action: PayloadAction<{ target: keyof CardphotoBase; image: ImageMeta }>,
    ) {
      if (!state.state) return
      const { target, image } = action.payload
      state.state.base[target].image = image
    },

    setGalleryList(state, action: PayloadAction<GalleryItem[]>) {
      state.galleryItems = action.payload
    },

    addItemToGallery(state, action: PayloadAction<GalleryItem>) {
      if (!state.galleryItems) {
        state.galleryItems = []
      }

      state.galleryItems.unshift(action.payload)
    },

    removeItemFromGallery(state, action: PayloadAction<string>) {
      if (state.galleryItems) {
        state.galleryItems = state.galleryItems.filter(
          (item) => item.id !== action.payload,
        )
      }
    },

    uploadUserImage(state, action: PayloadAction<ImageMeta>) {
      if (!state.state) return
      state.state.base.user.image = action.payload
    },

    // addOperation(state, action: PayloadAction<CardphotoOperation>) {
    //   if (!state.state) return
    //   const op = action.payload

    //   state.state.operations = state.state.operations.slice(
    //     0,
    //     state.state.activeIndex + 1,
    //   )

    //   state.state.operations.push(op)
    //   state.state.activeIndex = state.state.operations.length - 1

    //   state.state.currentConfig = op.payload.config
    // },

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

      if (op.payload.reason === 'applyCrop') {
        state.state.cropIndices.push(newIndex)
      }
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
  },
})

export const {
  initCardphoto,
  uploadImageReady,
  resetCardphoto,
  initStockImage,
  setGalleryList,
  addItemToGallery,
  removeItemFromGallery,
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
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
