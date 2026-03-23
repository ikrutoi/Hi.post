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
  CardphotoImageStageRect,
} from '../../domain/types'

/** Editor focus: same meta as active `base` slot (parallel to legacy `assetImage`). */
function syncAssetDataFromActiveSource(draft: CardphotoState) {
  const img =
    draft.activeSource != null
      ? (draft.base[draft.activeSource]?.image ?? null)
      : null
  draft.assetImage = img
  draft.assetData = img
}

function syncAppliedDataFromBase(draft: CardphotoState) {
  draft.appliedData = draft.base.apply.image ?? null
}
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
    assetImage: null,
    assetData: null,
    appliedData: null,
    assetConfig: null,
    applied: null,
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
          assetImage: null,
          assetData: null,
          appliedData: null,
          assetConfig: normalizedConfig,
          applied: state.state.applied ?? null,
          imageStageRect: null,
        }
        syncAssetDataFromActiveSource(state.state)
        syncAppliedDataFromBase(state.state)
      } else {
        state.state = {
          base,
          activeSource,
          assetImage: null,
          assetData: null,
          appliedData: null,
          assetConfig: normalizedConfig,
          applied: null,
          imageStageRect: null,
        }
        syncAssetDataFromActiveSource(state.state)
        syncAppliedDataFromBase(state.state)
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
      if (state.state.activeSource === target) {
        state.state.assetImage = image ?? null
        state.state.assetData = image ?? null
      }
      if (target === 'apply') {
        syncAppliedDataFromBase(state.state)
      }
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
      state.state.base.apply.image = action.payload
      state.state.applied = action.payload?.id ?? null
      state.state.appliedData = action.payload
      state.state.assetImage = action.payload
      state.state.assetData = action.payload
      state.isComplete = !!action.payload
    },

    clearApply(state) {
      if (!state.state) return
      state.state.base.apply.image = null
      state.state.applied = null
      state.state.appliedData = null
      state.isComplete = false
      syncAssetDataFromActiveSource(state.state)
    },

    reset(state) {
      if (!state.state) return
      state.state.base.apply.image = null
      state.state.applied = null
      state.state.assetConfig = null
      state.state.assetImage = null
      state.state.assetData = null
      state.state.appliedData = null
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
      state.state.assetConfig = workingConfig
      state.state.appliedData = null
      state.isComplete = false
      syncAssetDataFromActiveSource(state.state)
    },

    setActiveSource(state, action: PayloadAction<ActiveImageSource>) {
      if (state.state) {
        state.state.activeSource = action.payload
        syncAssetDataFromActiveSource(state.state)
      }
    },

    setInitialSessionState(
      state,
      action: PayloadAction<{ config: WorkingConfig; source: ActiveImageSource }>,
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
        state.state.base.processed.image = action.payload
        state.state.activeSource = 'processed'
        state.state.assetImage = action.payload
        state.state.assetData = action.payload
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
          syncAssetDataFromActiveSource(state.state)
        }
      }
    },

    removeUserImage(state) {
      const cp = state.state
      if (cp) {
        cp.base.user.image = null
        if (cp.activeSource === 'user') {
          syncAssetDataFromActiveSource(cp)
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
        const { source, config, apply, activeMetaId } = action.payload

        state.state.imageStageRect = null
        state.state.base.apply.image = apply
        state.state.applied = apply?.id ?? null
        state.state.appliedData = apply
        state.isComplete = !!apply
        state.state.activeSource = source
        const metaFromConfig = (config?.image as { meta?: ImageMeta } | undefined)
          ?.meta

        if (config) {
          state.state.assetConfig = {
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

        const metaAfter =
          state.state.assetConfig?.image?.meta ?? metaFromConfig
        const nextAsset =
          source === 'apply' && apply
            ? apply
            : metaAfter?.id
              ? metaAfter
              : null
        state.state.assetImage = nextAsset
        state.state.assetData = nextAsset
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
  setCardphotoImageStageRect,
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
