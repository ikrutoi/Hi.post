import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import { roundTo } from '@shared/utils/layout'
import { checkIsCropFull } from '../../application/helpers'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import type {
  CardphotoState,
  WorkingConfig,
  ImageMeta,
  CardLayer,
  CardphotoBase,
  ActiveImageSource,
  CardphotoSessionRecord,
} from '../../domain/types'
import { cardEditorReducer } from '@/entities/cardEditor/infrastructure/state'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'

export const selectCardphotoSlice = (state: RootState) => state.cardphoto

// Don't use stub: `applyFinal` updates `cardphoto.isComplete`.
const CARDPHOTO_IS_COMPLETE_STUB = false

export const selectCardphotoState = (state: RootState): CardphotoState | null =>
  state.cardphoto.state

export const selectCardphotoIsComplete = (state: RootState): boolean =>
  CARDPHOTO_IS_COMPLETE_STUB ? false : state.cardphoto.isComplete

export const selectStockImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.stock.image || null

export const selectUserImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.user.image || null

export const selectAppliedImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.apply.image || null

export const selectCurrentConfig = (state: RootState): WorkingConfig | null => {
  return state.cardphoto.state?.currentConfig ?? null
}

export const selectCardphotoPhotoStageRect = (state: RootState) =>
  state.cardphoto.state?.photoStageRect ?? null

export const selectCardphotoWorkingCardLayer = createSelector(
  [selectSizeCard, selectCardphotoPhotoStageRect],
  (layoutCard, rect): CardLayer => {
    const orientation = layoutCard.orientation ?? 'landscape'
    const aspectRatio = layoutCard.aspectRatio
    if (rect && rect.width > 1 && rect.height > 1) {
      return {
        width: rect.width,
        height: rect.height,
        aspectRatio,
        orientation,
      }
    }
    return {
      width: layoutCard.width,
      height: layoutCard.height,
      aspectRatio,
      orientation,
    }
  },
)

export const selectCurrentImageMeta = (state: RootState): ImageMeta | null =>
  selectCurrentConfig(state)?.image?.meta ?? null

export const selectIsCurrentCropApplied = (state: RootState): boolean => {
  const cp = state.cardphoto.state
  if (!cp) return false

  const currentImg = cp.currentConfig?.image.meta
  const appliedImg = cp.base.apply.image

  if (!currentImg || !appliedImg) return false

  return currentImg.id === appliedImg.id
}

const selectCurrentCard = (state: RootState) =>
  state.cardphoto.state?.currentConfig?.card

export const selectCardSize = createSelector([selectCurrentCard], (card) => {
  if (!card) return { width: 0, height: 0 }
  return {
    width: card.width,
    height: card.height,
  }
})

export const selectBaseImageByTarget = (
  state: RootState,
  target: keyof CardphotoBase,
): ImageMeta | null => {
  const base = state.cardphoto.state?.base
  return base?.[target]?.image ?? null
}

export const selectIsCropFull = createSelector(
  [selectCurrentConfig],
  (config) => {
    if (!config?.crop) return false
    return checkIsCropFull(config)
  },
)

export const selectCropQualityProgress = (state: RootState): number =>
  state.cardphoto.state?.currentConfig?.crop?.meta?.qualityProgress ?? 0

export const selectActiveSource = (
  state: RootState,
): ActiveImageSource | null => {
  const cardState = state.cardphoto.state
  if (!cardState) return null
  return cardState.activeSource || null
}

export const selectActiveImage = (state: RootState): ImageMeta | null => {
  const cp = state.cardphoto.state
  if (!cp || !cp.activeSource) return null

  const { activeSource, base } = cp
  return base[activeSource]?.image || null
}

export const selectActiveImage1 = (state: RootState): ImageMeta | null => {
  const cp = state.cardphoto.state
  if (!cp) return null

  const { activeSource, base } = cp

  if (activeSource === 'apply' && base.apply.image) {
    return base.apply.image
  }

  if (activeSource === 'processed' && base.processed.image) {
    return base.processed.image
  }

  if (activeSource === 'user' && base.user.image) {
    return base.user.image
  }

  if (activeSource === 'stock' && base.stock.image) {
    return base.stock.image
  }

  return base.processed.image || base.user.image || base.stock.image || null
}

export const selectIsProcessedMode = (state: RootState): boolean =>
  state.cardphoto.state?.activeSource === 'processed'

export const selectCardphotoSessionRecord = createSelector(
  [
    (state: RootState) => state.cardphoto.state,
    selectCardphotoIsComplete,
    selectAppliedImage,
  ],
  (s, isComplete, appliedImage): CardphotoSessionRecord | null => {
    if (!s || !s.activeSource || !s.currentConfig) return null

    const { activeSource, currentConfig: config } = s

    const activeMetaId =
      activeSource === 'user'
        ? CURRENT_EDITOR_IMAGE_ID
        : activeSource === 'apply'
          ? 'current_apply_image'
          : config.image.meta.id

    return {
      appliedImageUrl: appliedImage?.url || null,
      source: activeSource,
      activeMetaId,
      config: {
        card: config.card,
        image: {
          left: config.image.left,
          top: config.image.top,
          rotation: config.image.rotation,
          metaId: activeMetaId,
        },
        crop: config.crop,
      },
      apply: appliedImage,
      isComplete: isComplete,
    }
  },
)

export const selectCardphotoPreview = createSelector(
  [
    (state: RootState) => state.cardphoto.state?.base.apply.image?.id,
    (state: RootState) => state.assetRegistry.images,
    selectCardphotoIsComplete,
  ],
  (id, registry, isComplete) => {
    const asset = id ? registry[id] : null
    const previewUrl =
      isComplete && asset ? asset.thumbUrl || asset.url || null : null

    return {
      previewUrl,
      isComplete,
      id: id || 'empty',
    }
  },
)

export const selectCardphotoMiniPreview = createSelector(
  [
    (state: RootState) => state.cardphoto.state?.applied ?? null,
    (state: RootState) => state.assetRegistry.images,
  ],
  (appliedId, registry) => {
    if (!appliedId) return null
    const asset = registry[appliedId]
    const previewUrl = asset?.thumbUrl || asset?.url || null
    if (!previewUrl) return null
    return { previewUrl, id: appliedId }
  },
)

export const selectCropById = createSelector(
  [
    (state: RootState) => state.cardphoto.state?.base.processed.image,
    (state: RootState) => state.cardphoto.state?.base.apply.image,
    (state: RootState, cropId: string) => cropId,
  ],
  (processed, applied, cropId) => {
    if (processed?.id === cropId) return processed
    if (applied?.id === cropId) return applied
    return null
  },
)
