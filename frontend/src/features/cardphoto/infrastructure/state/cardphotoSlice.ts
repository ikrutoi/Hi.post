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
  CardphotoSessionRecord,
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

const pushOperation = (
  state: { state: CardphotoState | null },
  config: WorkingConfig,
  reason: CardphotoOperation['payload']['reason'] = 'init',
) => {
  const s = state.state
  if (!s) return

  const op: CardphotoOperation = {
    type: 'operation',
    payload: { config, reason },
  }

  s.operations = s.operations.slice(0, s.activeIndex + 1)

  s.operations.push(op)

  if (s.operations.length > 7) {
    s.operations = s.operations.slice(-7)
  }

  s.activeIndex = s.operations.length - 1
  s.currentConfig = config
}

export const cardphotoSlice = createSlice({
  name: 'cardphoto',
  initialState,
  reducers: {
    initCardphoto() {},

    uploadImageReady(state, action: PayloadAction<ImageMeta>) {},

    resetCardphoto: () => initialState,

    selectCropFromHistory(state, action: PayloadAction<string>) {},

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
      // console.log('hydrateEditor--->>> base', base)
      console.log('hydrateEditor--->>> apply', base.apply)
      console.log('hydrateEditor--->>> source', activeSource)

      if (state.state) {
        state.state.base.stock = base.stock
        state.state.base.user = base.user
        state.state.base.processed = base.processed
        state.state.base.apply = base.apply

        state.state.activeSource = activeSource
        state.state.cropCount = cropCount
        state.state.cropIds = cropIds

        // pushOperation(state, config, 'reset')
      } else {
        state.state = {
          base,
          operations: [
            { type: 'operation', payload: { config, reason: 'reset' } },
          ],
          activeIndex: 0,
          cropCount,
          cropIds,
          activeSource,
          currentConfig: config,
        }
      }
      // state.isComplete = false
    },

    setBaseImage(
      state,
      action: PayloadAction<{ target: keyof CardphotoBase; image: ImageMeta }>,
    ) {
      if (!state.state) return
      const { target, image } = action.payload
      state.state.base[target].image = image
    },

    uploadUserImage(state, action: PayloadAction<ImageMeta>) {},

    addOperation(state, action: PayloadAction<CardphotoOperation>) {
      pushOperation(
        state,
        action.payload.payload.config,
        action.payload.payload.reason,
      )
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

        const { cropIds } = state.state

        if (!cropIds.includes(action.payload)) {
          cropIds.push(action.payload)

          if (cropIds.length > 10) {
            cropIds.shift()
          }

          // state.state.cropCount = cropIds.length
        }
      }
    },

    setInitialSessionState(
      state,
      action: PayloadAction<{ config: WorkingConfig; source: ImageSource }>,
    ) {
      if (state.state) {
        state.state.currentConfig = action.payload.config
      }
    },

    // addCropId(state, action: PayloadAction<string>) {
    //   if (state.state) {
    //     if (!state.state.cropIds) state.state.cropIds = []
    //     if (!state.state.cropIds.includes(action.payload)) {
    //       state.state.cropIds.push(action.payload)
    //       state.state.cropCount = state.state.cropIds.length
    //     }
    //   }
    // },

    setProcessedImage(state, action: PayloadAction<ImageMeta>) {
      if (state.state) {
        state.state.base.processed.image = action.payload
        state.state.activeSource = 'processed'
      }
    },

    clearAllCrops(state) {
      if (state.state) {
        state.state.cropIds = []
        // state.state.cropCount = 0

        if (state.state.activeSource === 'processed') {
          state.state.activeSource = 'user'
          state.state.base.processed.image = null
        }
      }
    },

    removeUserImage(state) {
      const cp = state.state
      if (cp) cp.base.user.image = null
    },

    removeCropId(state, action: PayloadAction<string>) {
      const cp = state.state
      if (!cp) return
      const targetId = action.payload

      cp.cropIds = cp.cropIds.filter((id) => id !== targetId)
      cp.cropCount = cp.cropIds.length

      if (cp.base.processed.image?.id === targetId) {
        cp.base.processed.image = null
      }
    },

    clearCurrentConfig(state) {
      if (state.state) {
        state.state.currentConfig = null
      }
    },

    restoreSession(state, action: PayloadAction<CardphotoSessionRecord>) {
      if (state.state) {
        const { source, config, apply, isComplete, cropIds } = action.payload

        state.state.activeSource = source

        state.isComplete = isComplete

        state.state.base.apply.image = apply

        state.state.cropIds = cropIds || []
        state.state.cropCount = (cropIds || []).length

        state.state.currentConfig = {
          card: config.card,
          crop: config.crop,
          image: {
            ...config.image,
            meta:
              (config.image as any).meta ||
              ({ id: config.image.metaId } as ImageMeta),
          },
        }
      }
    },
  },
})

export const {
  initCardphoto,
  uploadImageReady,
  resetCardphoto,
  selectCropFromHistory,
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
  setInitialSessionState,
  setProcessedImage,
  hydrateEditor,
  removeCropId,
  clearAllCrops,
  removeUserImage,
  clearCurrentConfig,
  restoreSession,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
