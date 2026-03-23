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
  CardphotoPhotoStageRect,
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
    activeSource: null,
    currentConfig: null,
    applied: null,
    photoStageRect: null,
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

    hydrateEditor(
      state,
      action: PayloadAction<{
        base: CardphotoBase
        config: WorkingConfig
        activeSource: ActiveImageSource
        isComplete: boolean
      }>,
    ) {
      const { base, config, activeSource } = action.payload

      const normalizedConfig: WorkingConfig = {
        ...config,
        card: {
          ...config.card,
          orientation: config.card.orientation ?? 'landscape',
        },
      }

      if (state.state) {
        state.state = {
          base,
          activeSource,
          currentConfig: normalizedConfig,
          applied: state.state.applied ?? null,
          photoStageRect: null,
        }
      } else {
        state.state = {
          base,
          activeSource,
          currentConfig: normalizedConfig,
          applied: null,
          photoStageRect: null,
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

    setCardphotoPhotoStageRect(
      state,
      action: PayloadAction<CardphotoPhotoStageRect | null>,
    ) {
      if (state.state) {
        state.state.photoStageRect = action.payload
      }
    },

    applyFinal(state, action: PayloadAction<ImageMeta>) {
      if (!state.state) return
      state.state.base.apply.image = action.payload
      state.state.applied = action.payload?.id ?? null
      state.isComplete = !!action.payload
    },

    clearApply(state) {
      if (!state.state) return
      state.state.base.apply.image = null
      state.state.applied = null
      state.isComplete = false
    },

    reset(state) {
      if (!state.state) return
      state.state.base.apply.image = null
      state.state.applied = null
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
      state.state.applied = null
      state.state.currentConfig = workingConfig
      state.isComplete = false
    },

    setActiveSource(state, action: PayloadAction<ActiveImageSource>) {
      if (state.state) {
        state.state.activeSource = action.payload
      }
    },

    setInitialSessionState(
      state,
      action: PayloadAction<{ config: WorkingConfig; source: ActiveImageSource }>,
    ) {
      if (state.state) {
        const cfg = action.payload.config
        state.state.currentConfig = {
          ...cfg,
          card: {
            ...cfg.card,
            orientation: cfg.card.orientation ?? 'landscape',
          },
        }
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
        if (state.state.activeSource === 'processed') {
          state.state.base.processed.image = null
          state.state.activeSource = state.state.base.user.image
            ? 'user'
            : state.state.base.stock.image
              ? 'stock'
              : null
        }
      }
    },

    removeUserImage(state) {
      const cp = state.state
      if (cp) cp.base.user.image = null
    },

    clearCurrentConfig(state) {
      if (state.state) {
        state.state.currentConfig = null
      }
    },

    restoreSession(state, action: PayloadAction<CardphotoSessionRecord>) {
      if (state.state) {
        const { source, config, apply, activeMetaId } = action.payload

        state.state.photoStageRect = null
        state.state.base.apply.image = apply
        state.state.applied = apply?.id ?? null
        state.isComplete = !!apply
        state.state.activeSource = source

        if (config) {
          state.state.currentConfig = {
            card: {
              ...config.card,
              orientation: config.card.orientation ?? 'landscape',
            },
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
  setBaseImage,
  uploadUserImage,
  commitWorkingConfig,
  setCardphotoPhotoStageRect,
  applyFinal,
  clearApply,
  reset,
  cancelSelection,
  resetCropLayers,
  setActiveSource,
  setInitialSessionState,
  setProcessedImage,
  hydrateEditor,
  clearAllCrops,
  removeUserImage,
  clearCurrentConfig,
  restoreSession,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
