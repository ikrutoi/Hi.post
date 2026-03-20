import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import { roundTo } from '@shared/utils/layout'
import { checkIsCropFull } from '../../application/helpers'
import type {
  CardphotoState,
  WorkingConfig,
  ImageMeta,
  CardphotoBase,
  QualityLevel,
  ActiveImageSource,
  CardphotoSessionRecord,
} from '../../domain/types'
import { cardEditorReducer } from '@/entities/cardEditor/infrastructure/state'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'

export const selectCardphotoSlice = (state: RootState) => state.cardphoto

/** Заглушка: при true селектор всегда возвращает false (картинка не лезет). Потом разобраться. */
const CARDPHOTO_IS_COMPLETE_STUB = true

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

export const selectCurrentImageMeta = (state: RootState): ImageMeta | null =>
  selectCurrentConfig(state)?.image?.meta ?? null

export const selectCropIds = (state: RootState): string[] =>
  state.cardphoto.state?.cropIds ?? []

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
    if (!config) return false
    const { crop, image } = config

    const isRotated = image.rotation === 90 || image.rotation === 270

    const vWidth = isRotated ? image.meta.height : image.meta.width
    const vHeight = isRotated ? image.meta.width : image.meta.height

    const isFullWidth = Math.abs(crop.meta.width - vWidth) < 0.5
    const isFullHeight = Math.abs(crop.meta.height - vHeight) < 0.5

    return isFullWidth || isFullHeight
  },
)

export const selectCropQuality = (state: RootState): QualityLevel =>
  state.cardphoto.state?.currentConfig?.crop?.meta?.quality ?? 'low'

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

export const selectCardphotoCropIds = (state: RootState): string[] =>
  state.cardphoto.state?.cropIds || []

export const selectIsProcessedMode = (state: RootState): boolean =>
  state.cardphoto.state?.activeSource === 'processed'

export const selectCardphotoSessionRecord = createSelector(
  [
    (state: RootState) => state.cardphoto.state,
    selectCardphotoIsComplete,
    selectAppliedImage,
    selectCardphotoCropIds,
  ],
  (s, isComplete, appliedImage, cropIds): CardphotoSessionRecord | null => {
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
      cropIds: cropIds,
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
      isComplete && asset
        ? asset.thumbUrl || asset.url || null
        : null

    return {
      previewUrl,
      isComplete,
      id: id || 'empty',
    }
  },
)

/** Preview for mini section: only when user has chosen an image (appended). */
export const selectCardphotoMiniPreview = createSelector(
  [
    (state: RootState) => state.cardphoto.state?.appended ?? null,
    (state: RootState) => state.assetRegistry.images,
  ],
  (appendedId, registry) => {
    if (!appendedId) return null
    const asset = registry[appendedId]
    const previewUrl = asset?.thumbUrl || asset?.url || null
    if (!previewUrl) return null
    return { previewUrl, id: appendedId }
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
