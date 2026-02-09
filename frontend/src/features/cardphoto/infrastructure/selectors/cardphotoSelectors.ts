import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import { roundTo } from '@shared/utils/layout'
import { checkIsCropFull } from '../../application/helpers'
import type {
  CardphotoState,
  CardphotoOperation,
  WorkingConfig,
  ImageMeta,
  CardphotoBase,
  QualityLevel,
  GalleryItem,
  ImageSource,
  CardphotoSessionRecord,
} from '../../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'
import { cardEditorReducer } from '@/entities/cardEditor/infrastructure/state'

export const selectCardphotoSlice = (state: RootState) => state.cardphoto

export const selectCardphotoState = (state: RootState): CardphotoState | null =>
  state.cardphoto.state

export const selectCardphotoIsComplete = (state: RootState): boolean =>
  state.cardphoto.isComplete

export const selectStockImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.stock.image || null

export const selectUserImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.user.image || null

export const selectAppliedImage = (state: RootState): ImageMeta | null =>
  state.cardphoto.state?.base.apply.image || null

export const selectOperations = (state: RootState): CardphotoOperation[] =>
  state.cardphoto.state?.operations ?? []

export const selectActiveIndex = (state: RootState): number =>
  state.cardphoto.state?.activeIndex ?? -1

export const selectActiveOperation = createSelector(
  [selectOperations, selectActiveIndex],
  (operations, index) => (index >= 0 ? (operations[index] ?? null) : null),
)

export const selectCurrentConfig = (state: RootState): WorkingConfig | null => {
  return state.cardphoto.state?.currentConfig ?? null
}

export const selectCurrentImageMeta = (state: RootState): ImageMeta | null =>
  selectCurrentConfig(state)?.image?.meta ?? null

export const selectCardOrientation = (state: RootState): LayoutOrientation =>
  state.cardphoto.state?.currentConfig?.card.orientation ?? 'landscape'

export const selectCropIds = (state: RootState): string[] =>
  state.cardphoto.state?.cropIds ?? []

export const selectCropOrientation = (state: RootState): LayoutOrientation =>
  state.cardphoto.state?.currentConfig?.crop?.orientation ??
  state.cardphoto.state?.currentConfig?.card.orientation ??
  'landscape'

export const selectIsCurrentCropApplied = (state: RootState): boolean => {
  const cp = state.cardphoto.state
  if (!cp) return false

  const currentImg = cp.currentConfig?.image.meta
  const appliedImg = cp.base.apply.image

  if (!currentImg || !appliedImg) return false

  return currentImg.id === appliedImg.id
}

export const selectLastOperationReason = (state: RootState): string | null => {
  const cardState = state.cardphoto.state
  if (!cardState) return null

  const activeOp = cardState.operations[cardState.activeIndex]
  return activeOp?.payload.reason ?? null
}

const selectCurrentCard = (state: RootState) =>
  state.cardphoto.state?.currentConfig?.card

export const selectCardSize = createSelector([selectCurrentCard], (card) => {
  if (!card) return { width: 0, height: 0, orientation: 'landscape' }
  return {
    width: card.width,
    height: card.height,
    orientation: card.orientation,
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

export const selectActiveSource = (state: RootState): ImageSource | null => {
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
        ? 'current_user_image'
        : activeSource === 'apply'
          ? 'current_apply_image'
          : config.image.meta.id

    return {
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
