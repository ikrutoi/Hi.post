import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  WorkingConfig,
  CardphotoState,
  CardphotoBase,
  ImageLayer,
  CropLayer,
  CardLayer,
  ActiveImageSource,
  CardphotoSessionRecord,
} from '../../domain/types'
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
    cropCount: 0,
    cropIds: [],
    activeSource: null,
    currentConfig: null,
    appended: null,
  },
  isComplete: false,
}

// const pushOperation = (
//   state: { state: CardphotoState | null },
//   config: WorkingConfig,
//   reason: CardphotoOperation['payload']['reason'] = 'init',
// ) => {
//   const s = state.state
//   if (!s) return

//   const op: CardphotoOperation = {
//     type: 'operation',
//     payload: { config, reason },
//   }

//   s.operations = s.operations.slice(0, s.activeIndex + 1)

//   s.operations.push(op)

//   if (s.operations.length > 7) {
//     s.operations = s.operations.slice(-7)
//   }

//   s.activeIndex = s.operations.length - 1
//   s.currentConfig = config
// }

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
        activeSource: ActiveImageSource
        cropIds: string[]
        cropCount: number
        isComplete: boolean
      }>,
    ) {
      const { base, config, activeSource, cropIds, cropCount } = action.payload

      if (state.state) {
        state.state = {
          base,
          cropCount,
          cropIds,
          activeSource,
          currentConfig: config,
          appended: state.state.appended ?? null,
        }
      } else {
        state.state = {
          base,
          cropCount,
          cropIds,
          activeSource,
          currentConfig: config,
          appended: null,
        }
      }
      state.isComplete = !!state.state.base.apply?.image
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

    // addOperation(state, action: PayloadAction<CardphotoOperation>) {
    //   pushOperation(
    //     state,
    //     action.payload.payload.config,
    //     action.payload.payload.reason,
    //   )
    // },

    commitWorkingConfig(state, action: PayloadAction<WorkingConfig>) {
      if (state.state) {
        state.state.currentConfig = action.payload
      }
    },

    applyFinal(state, action: PayloadAction<ImageMeta>) {
      if (!state.state) return
      state.state.base.apply.image = action.payload
      state.isComplete = !!action.payload
    },

    clearApply(state) {
      if (!state.state) return
      state.state.base.apply.image = null
      state.state.appended = null
      state.isComplete = false
    },

    reset(state) {
      if (!state.state) return
      state.state.base.apply.image = null
      state.state.appended = null
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

      state.state.base.apply.image = null
      state.state.appended = null
      state.state.currentConfig = workingConfig
      state.isComplete = false
    },

    setActiveSource(state, action: PayloadAction<ActiveImageSource>) {
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

          // if (cropIds.length > 10) {
          //   cropIds.shift()
          // }

          // state.state.cropCount = cropIds.length
        }
      }
    },

    setInitialSessionState(
      state,
      action: PayloadAction<{ config: WorkingConfig; source: ActiveImageSource }>,
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
        const { source, config, apply, cropIds, activeMetaId } = action.payload

        state.state.base.apply.image = apply
        state.state.appended = null
        state.isComplete = !!apply
        state.state.activeSource = source
        state.state.cropIds = cropIds || []
        state.state.cropCount = (cropIds || []).length

        if (config) {
          state.state.currentConfig = {
            card: config.card,
            crop: config.crop,
            image: {
              left: config.image.left,
              top: config.image.top,
              rotation: config.image.rotation,
              meta:
                (config.image as any).meta ||
                ({
                  id: config.image.metaId || activeMetaId || '',
                  url: apply?.url || '',
                } as ImageMeta),
            },
          }
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
  commitWorkingConfig,
  applyFinal,
  clearApply,
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
