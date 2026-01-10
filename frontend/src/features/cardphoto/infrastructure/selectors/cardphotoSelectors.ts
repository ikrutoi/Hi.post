import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import { roundTo } from '@shared/utils/layout'
import type {
  CardphotoState,
  CardphotoOperation,
  WorkingConfig,
  ImageMeta,
  CardphotoBase,
} from '../../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

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

export const selectOperations = createSelector(
  (state: RootState) => state.cardphoto.state?.operations,
  (operations): CardphotoOperation[] => operations ?? []
)

export const selectActiveIndex = (state: RootState): number =>
  state.cardphoto.state?.activeIndex ?? -1

export const selectActiveOperation = createSelector(
  [selectOperations, selectActiveIndex],
  (operations, index) => (index >= 0 ? (operations[index] ?? null) : null)
)

export const selectCurrentConfig = (state: RootState): WorkingConfig | null =>
  state.cardphoto.state?.currentConfig ?? null

export const selectCurrentImageMeta = createSelector(
  [selectCurrentConfig],
  (config): ImageMeta | null => config?.image?.meta ?? null
)

export const selectCardOrientation = (state: RootState): LayoutOrientation =>
  state.cardphoto.state?.currentConfig?.card.orientation ?? 'landscape'

export const selectCropOrientation = (state: RootState): LayoutOrientation =>
  state.cardphoto.state?.currentConfig?.crop.orientation ??
  state.cardphoto.state?.currentConfig?.card.orientation ??
  'landscape'

export const selectLastOperationReason = (state: RootState) =>
  state.cardphoto.state?.operations[state.cardphoto.state.activeIndex]?.payload
    .reason ?? null

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

export const selectBaseImageByTarget = createSelector(
  [
    (state: RootState) => state.cardphoto.state?.base,
    (_state: RootState, target: keyof CardphotoBase) => target,
  ],
  (base, target): ImageMeta | null => {
    if (!base || !target) return null
    return base[target].image || null
  }
)

export const selectActiveSourceImage = createSelector(
  [selectCardphotoState],
  (state): ImageMeta | null => {
    if (!state) return null
    return state.base.user.image || state.base.stock.image
  }
)

export const selectIsCropFull = createSelector(
  [selectCurrentConfig],
  (config): boolean => {
    if (!config || !config.crop) return false

    const { image, card, crop } = config
    const isRotated = image.orientation === 90 || image.orientation === 270

    const currentVisualAR = isRotated
      ? roundTo(1 / image.meta.imageAspectRatio, 3)
      : image.meta.imageAspectRatio

    const targetAR = card.aspectRatio

    let maxWidth = 0
    let maxHeight = 0

    if (currentVisualAR > targetAR) {
      maxHeight = image.meta.height
      maxWidth = roundTo(maxHeight * targetAR, 2)
    } else {
      maxWidth = image.meta.width
      maxHeight = roundTo(maxWidth / targetAR, 2)
    }

    const isFullWidth = Math.abs(crop.meta.width - maxWidth) < 2
    const isFullHeight = Math.abs(crop.meta.height - maxHeight) < 2

    return isFullWidth && isFullHeight
  }
)
