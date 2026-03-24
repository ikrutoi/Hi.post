import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  WorkingConfig,
  CardphotoState,
  ImageLayer,
  CropLayer,
  CardLayer,
  CardphotoSessionRecord,
  CardphotoImageStageRect,
} from '../../domain/types'
import { shouldSyncUserOriginalOnRebuild } from '../../application/helpers/syncUserOriginal'

function toLightImageMeta(meta: ImageMeta | null): ImageMeta | null {
  if (!meta) return null
  return {
    ...meta,
    full: {
      ...meta.full,
      blob: undefined,
    },
    thumbnail: meta.thumbnail
      ? {
          ...meta.thumbnail,
          blob: undefined,
        }
      : undefined,
  }
}

export interface CardphotoSliceState {
  state: CardphotoState
  isComplete: boolean
}

const initialState: CardphotoSliceState = {
  state: {
    assetData: null,
    appliedData: null,
    userOriginalData: null,
    assetConfig: null,
    imageStageRect: null,
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
//   s.assetConfig = config
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
        config: WorkingConfig
        isComplete: boolean
        appliedData?: ImageMeta | null
        assetData?: ImageMeta | null
        userOriginalData?: ImageMeta | null
      }>,
    ) {
      const { config, appliedData, assetData, userOriginalData } = action.payload

      const normalizedConfig: WorkingConfig = {
        ...config,
        card: {
          ...config.card,
          orientation: config.card.orientation ?? 'landscape',
        },
      }

      if (state.state) {
        state.state = {
          assetData: null,
          appliedData: null,
          userOriginalData: null,
          assetConfig: normalizedConfig,
          imageStageRect: null,
        }
      } else {
        state.state = {
          assetData: null,
          appliedData: null,
          userOriginalData: null,
          assetConfig: normalizedConfig,
          imageStageRect: null,
        }
      }
      if (appliedData !== undefined) {
        state.state.appliedData = appliedData
      }
      if (assetData !== undefined) {
        state.state.assetData = assetData
      }
      if (userOriginalData !== undefined) {
        state.state.userOriginalData = userOriginalData
      }
      state.isComplete = !!state.state.appliedData
    },

    uploadUserImage(state, action: PayloadAction<ImageMeta>) {},

    setAssetData(state, action: PayloadAction<ImageMeta | null>) {
      if (!state.state) return
      state.state.assetData = action.payload
    },

    setUserOriginalData(state, action: PayloadAction<ImageMeta | null>) {
      if (!state.state) return
      state.state.userOriginalData = action.payload
    },

    // addOperation(state, action: PayloadAction<CardphotoOperation>) {
    //   pushOperation(
    //     state,
    //     action.payload.payload.config,
    //     action.payload.payload.reason,
    //   )
    // },

    commitWorkingConfig(state, action: PayloadAction<WorkingConfig>) {
      if (state.state) {
        state.state.assetConfig = action.payload
      }
    },

    setCardphotoImageStageRect(
      state,
      action: PayloadAction<CardphotoImageStageRect | null>,
    ) {
      if (state.state) {
        state.state.imageStageRect = action.payload
      }
    },

    applyFinal(state, action: PayloadAction<ImageMeta>) {
      if (!state.state) return
      state.state.appliedData = action.payload
      state.state.assetData = action.payload
      state.isComplete = !!action.payload
    },

    clearApply(state) {
      if (!state.state) return
      state.state.appliedData = null
      state.isComplete = false
    },

    reset(state) {
      if (!state.state) return
      state.state.assetConfig = null
      state.state.assetData = null
      state.state.appliedData = null
      state.state.userOriginalData = null
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

      state.state.assetConfig = workingConfig
      state.state.appliedData = null
      state.isComplete = false
    },

    setInitialSessionState(
      state,
      action: PayloadAction<{ config: WorkingConfig }>,
    ) {
      if (state.state) {
        const cfg = action.payload.config
        state.state.assetConfig = {
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
        state.state.assetData = action.payload
      }
    },

    clearAllCrops(state) {
      if (state.state) {
        if (state.state.assetData?.status === 'processed') {
          state.state.assetData = state.state.userOriginalData ?? null
        }
      }
    },

    removeUserImage(state) {
      const cp = state.state
      if (cp) {
        cp.userOriginalData = null
        if (shouldSyncUserOriginalOnRebuild(cp.assetData, cp.appliedData)) {
          cp.assetData = null
        }
      }
    },

    clearCurrentConfig(state) {
      if (state.state) {
        state.state.assetConfig = null
      }
    },

    restoreSession(state, action: PayloadAction<CardphotoSessionRecord>) {
      if (state.state) {
        const {
          assetConfig,
          appliedData,
          assetData,
          userOriginalData,
        } = action.payload
        const applied = appliedData

        state.state.imageStageRect = null
        state.state.appliedData = applied
        state.state.userOriginalData = userOriginalData
        state.isComplete = !!applied
        const metaFromConfig = (assetConfig.image as { meta?: ImageMeta }).meta

        state.state.assetConfig = {
          card: {
            ...assetConfig.card,
            orientation: assetConfig.card.orientation ?? 'landscape',
          },
          crop: assetConfig.crop,
          image: {
            left: assetConfig.image.left,
            top: assetConfig.image.top,
            rotation: assetConfig.image.rotation,
            meta:
              (assetConfig.image as any).meta ||
              ({
                id: assetConfig.image.metaId || assetData?.id || '',
                url: applied?.url || '',
              } as ImageMeta),
          },
        }

        const metaAfter =
          state.state.assetConfig?.image?.meta ?? metaFromConfig
        const nextAsset =
          assetData ?? applied ?? (metaAfter?.id ? metaAfter : null)
        state.state.assetData = nextAsset
      }
    },
  },
})

export const {
  initCardphoto,
  uploadImageReady,
  resetCardphoto,
  uploadUserImage,
  setAssetData,
  setUserOriginalData,
  commitWorkingConfig,
  setCardphotoImageStageRect,
  applyFinal,
  clearApply,
  reset,
  cancelSelection,
  resetCropLayers,
  setInitialSessionState,
  setProcessedImage,
  hydrateEditor,
  clearAllCrops,
  removeUserImage,
  clearCurrentConfig,
  restoreSession,
} = cardphotoSlice.actions

export default cardphotoSlice.reducer
