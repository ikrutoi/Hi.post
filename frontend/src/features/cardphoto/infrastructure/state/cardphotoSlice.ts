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
import { computeCardphotoAssetToolbar } from '../../application/helpers/computeCardphotoAssetToolbar'
import { deriveActiveSource } from '../../application/helpers/deriveActiveSource'

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

function syncAssetToolbar(draft: CardphotoState) {
  draft.assetToolbar = computeCardphotoAssetToolbar(draft)
}

function syncAssetDataFromActiveSource(draft: CardphotoState) {
  const activeSource = deriveActiveSource(draft)
  const img = activeSource != null ? (draft.base[activeSource]?.image ?? null) : null
  draft.assetData = img
  syncAssetToolbar(draft)
}

function syncAppliedDataFromBase(draft: CardphotoState) {
  draft.appliedData = draft.base.apply.image ?? null
}
export interface CardphotoSliceState {
  state: CardphotoState
  isComplete: boolean
}

const EMPTY_BASE: CardphotoBase = {
  stock: { image: null },
  user: { image: null },
  apply: { image: null },
  processed: { image: null },
}

const initialState: CardphotoSliceState = {
  state: {
    base: EMPTY_BASE,
    assetData: null,
    appliedData: null,
    userOriginalData: null,
    assetConfig: null,
    assetToolbar: null,
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
        base?: CardphotoBase
        config: WorkingConfig
        activeSource?: ActiveImageSource
        isComplete: boolean
        appliedData?: ImageMeta | null
        assetData?: ImageMeta | null
        userOriginalData?: ImageMeta | null
      }>,
    ) {
      const {
        base,
        config,
        appliedData,
        assetData,
        userOriginalData,
      } = action.payload
      const resolvedBase = base ?? state.state?.base ?? EMPTY_BASE

      const normalizedConfig: WorkingConfig = {
        ...config,
        card: {
          ...config.card,
          orientation: config.card.orientation ?? 'landscape',
        },
      }

      if (state.state) {
        state.state = {
          base: resolvedBase,
          assetData: null,
          appliedData: null,
          userOriginalData: toLightImageMeta(resolvedBase.user.image),
          assetConfig: normalizedConfig,
          assetToolbar: null,
          imageStageRect: null,
        }
        syncAssetDataFromActiveSource(state.state)
        syncAppliedDataFromBase(state.state)
      } else {
        state.state = {
          base: resolvedBase,
          assetData: null,
          appliedData: null,
          userOriginalData: toLightImageMeta(resolvedBase.user.image),
          assetConfig: normalizedConfig,
          assetToolbar: null,
          imageStageRect: null,
        }
        syncAssetDataFromActiveSource(state.state)
        syncAppliedDataFromBase(state.state)
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
      state.isComplete = !!(state.state.appliedData ?? state.state.base.apply?.image)
    },

    setBaseImage(
      state,
      action: PayloadAction<{ target: keyof CardphotoBase; image: ImageMeta }>,
    ) {
      if (!state.state) return
      const { target, image } = action.payload
      state.state.base[target].image = image
      if (target === 'apply') {
        syncAppliedDataFromBase(state.state)
      } else if (target === 'user') {
        state.state.userOriginalData = toLightImageMeta(image)
      }
      syncAssetDataFromActiveSource(state.state)
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
      state.state.appliedData = action.payload
      state.state.assetData = action.payload
      state.isComplete = !!action.payload
    },

    clearApply(state) {
      if (!state.state) return
      state.state.base.apply.image = null
      state.state.appliedData = null
      state.isComplete = false
      syncAssetDataFromActiveSource(state.state)
    },

    reset(state) {
      if (!state.state) return
      state.state.base.apply.image = null
      state.state.assetConfig = null
      state.state.assetData = null
      state.state.appliedData = null
      state.state.userOriginalData = null
      state.isComplete = false
      syncAssetToolbar(state.state)
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
      state.state.assetConfig = workingConfig
      state.state.appliedData = null
      state.isComplete = false
      syncAssetDataFromActiveSource(state.state)
    },

    setActiveSource(state, action: PayloadAction<ActiveImageSource>) {
      if (state.state) {
        state.state.assetData = state.state.base[action.payload]?.image ?? null
        syncAssetToolbar(state.state)
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
        state.state.assetData = action.payload
        syncAssetToolbar(state.state)
      }
    },

    clearAllCrops(state) {
      if (state.state) {
        if (deriveActiveSource(state.state) === 'processed') {
          state.state.base.processed.image = null
          state.state.assetData = state.state.base.user.image
            ? state.state.base.user.image
            : state.state.base.stock.image
              ? state.state.base.stock.image
              : null
          syncAssetToolbar(state.state)
        }
      }
    },

    removeUserImage(state) {
      const cp = state.state
      if (cp) {
        cp.base.user.image = null
        cp.userOriginalData = null
        if (deriveActiveSource(cp) === 'user') {
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
        const {
          assetConfigLight,
          appliedDataLight,
          assetDataLight,
          userOriginalData,
        } = action.payload
        const applied = appliedDataLight

        state.state.imageStageRect = null
        state.state.base.apply.image = applied
        state.state.appliedData = applied
        state.state.userOriginalData = userOriginalData
        state.isComplete = !!applied
        const metaFromConfig = (assetConfigLight.image as { meta?: ImageMeta }).meta

        state.state.assetConfig = {
          card: {
            ...assetConfigLight.card,
            orientation: assetConfigLight.card.orientation ?? 'landscape',
          },
          crop: assetConfigLight.crop,
          image: {
            left: assetConfigLight.image.left,
            top: assetConfigLight.image.top,
            rotation: assetConfigLight.image.rotation,
            meta:
              (assetConfigLight.image as any).meta ||
              ({
                id: assetConfigLight.image.metaId || assetDataLight?.id || '',
                url: applied?.url || '',
              } as ImageMeta),
          },
        }

        const metaAfter =
          state.state.assetConfig?.image?.meta ?? metaFromConfig
        const nextAsset =
          assetDataLight ?? applied ?? (metaAfter?.id ? metaAfter : null)
        state.state.assetData = nextAsset
        syncAssetToolbar(state.state)
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
