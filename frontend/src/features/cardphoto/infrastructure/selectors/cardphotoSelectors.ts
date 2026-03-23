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
  ImageSource,
  ImageStatus,
} from '../../domain/types'
import { findImageMetaByIdInBase } from '../../application/helpers/resolveImageMetaInBase'
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

/** Target field; during migration mirrors `selectAppliedImage` / `base.apply.image`. */
export const selectCardphotoAppliedData = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.appliedData ?? null

/** Target field; during migration mirrors active slot / `selectCardphotoAssetImage`. */
export const selectCardphotoAssetData = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.assetData ?? null

export const selectCardphotoAssetConfig = (state: RootState): WorkingConfig | null =>
  state.cardphoto.state?.assetConfig ?? null

export const selectCardphotoImageStageRect = (state: RootState) =>
  state.cardphoto.state?.imageStageRect ?? null

export const selectCardphotoWorkingCardLayer = createSelector(
  [selectSizeCard, selectCardphotoImageStageRect],
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
  selectCardphotoAssetConfig(state)?.image?.meta ?? null

export const selectIsCurrentCropApplied = (state: RootState): boolean => {
  const cp = state.cardphoto.state
  if (!cp) return false

  const currentImg = cp.assetConfig?.image.meta
  const appliedImg = cp.base.apply.image

  if (!currentImg || !appliedImg) return false

  return currentImg.id === appliedImg.id
}

const selectCurrentCard = (state: RootState) =>
  state.cardphoto.state?.assetConfig?.card

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
  [selectCardphotoAssetConfig],
  (config) => {
    if (!config?.crop) return false
    return checkIsCropFull(config)
  },
)

export const selectCropQualityProgress = (state: RootState): number =>
  state.cardphoto.state?.assetConfig?.crop?.meta?.qualityProgress ?? 0

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

/** `assetImage?.id ?? null` */
export const selectCardphotoAssetId = (state: RootState): string | null =>
  state.cardphoto.state?.assetImage?.id ?? null

/** Full meta for the image in focus (same object as in a `base` slot when synced). */
export const selectCardphotoAssetImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.assetImage ?? null

/**
 * Working image meta: prefer fresh copy from `base` by `assetImage.id`, then `assetImage`, else `selectActiveImage`.
 */
export const selectWorkingImageMeta = (state: RootState): ImageMeta | null => {
  const cp = state.cardphoto.state
  if (!cp) return null
  const id = cp.assetImage?.id
  if (id) {
    const fromBase = findImageMetaByIdInBase(cp.base, id)
    if (fromBase) return fromBase
  }
  if (cp.assetImage) return cp.assetImage
  return selectActiveImage(state)
}

export const selectWorkingImageSourceAndStatus = (
  state: RootState,
): { source: ImageSource; status: ImageStatus } | null => {
  const meta = selectWorkingImageMeta(state)
  if (!meta) return null
  return { source: meta.source, status: meta.status }
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
    if (!s || !s.activeSource || !s.assetConfig) return null

    const { activeSource, assetConfig: config } = s

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
    (state: RootState) => state.cardphoto.state?.base.apply.image ?? null,
    (state: RootState) => state.assetRegistry.images,
    selectCardphotoIsComplete,
  ],
  (applyImage, registry, isComplete) => {
    const id = applyImage?.id
    const asset = id ? registry[id] : null

    // `applyFinal` меняет редакторный state сразу, а assetRegistry может обновиться чуть позже.
    // Поэтому fallback берём из самого `applyImage`.
    const previewUrl =
      isComplete
        ? asset?.thumbUrl ||
          asset?.url ||
          applyImage?.thumbnail?.url ||
          applyImage?.url ||
          null
        : null

    return {
      previewUrl,
      isComplete,
      id: id || 'empty',
    }
  },
)

export const selectCardphotoMiniPreview = createSelector(
  [
    (state: RootState) => state.cardphoto.state?.base.apply.image ?? null,
    (state: RootState) => state.assetRegistry.images,
  ],
  (applyImage, registry) => {
    if (!applyImage) return null
    const id = applyImage.id
    const asset = registry[id]
    const previewUrl =
      asset?.thumbUrl ||
      asset?.url ||
      applyImage.thumbnail?.url ||
      applyImage.url ||
      null
    if (!previewUrl) return null
    return { previewUrl, id }
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
