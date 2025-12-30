import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { ImageOperation } from '@cardphoto/domain/types'

const selectCardphoto = (state: RootState) => state.cardphoto

export const selectActiveImage = createSelector(
  [selectCardphoto],
  (cardphoto) => cardphoto.activeImage
)

export const selectHistory = createSelector(
  [selectCardphoto],
  (cardphoto) => cardphoto.history
)

export const selectActiveIndex = createSelector(
  [selectHistory],
  (history) => history?.activeIndex ?? -1
)

export const selectOperations = createSelector(
  [selectHistory],
  (history) => history?.operations ?? []
)

export const selectIsComplete = createSelector(
  [selectCardphoto],
  (cardphoto) => cardphoto.isComplete
)

export const selectHasConfirmedImage = createSelector(
  [selectActiveImage, selectIsComplete],
  (activeImage, isComplete) => !!activeImage && isComplete
)

export const selectOriginalImage = createSelector(
  [selectHistory],
  (history) => history?.original ?? null
)

export const selectOperationsWithActive = createSelector(
  [selectOperations, selectActiveIndex],
  (operations, activeIndex) => ({
    operations,
    activeOperation: activeIndex >= 0 ? operations[activeIndex] : null,
  })
)

export const selectActiveOperation = createSelector(
  [selectOperations, selectActiveIndex],
  (operations, activeIndex): ImageOperation | null =>
    activeIndex >= 0 ? operations[activeIndex] : null
)

export const selectHasOperations = createSelector(
  [selectOperations],
  (operations) => operations.length > 0
)

export const selectCanUndo = createSelector(
  [selectActiveIndex],
  (activeIndex) => activeIndex >= 0
)

export const selectCanRedo = createSelector(
  [selectOperations, selectActiveIndex],
  (operations, activeIndex) => activeIndex < operations.length - 1
)

export const selectHasHistory = createSelector(
  [selectHistory],
  (history) => !!history
)

export const selectIsStockImage = createSelector(
  [selectActiveImage],
  (activeImage) => activeImage?.source === 'stock'
)

export const selectCardphotoContext = createSelector(
  [
    selectActiveImage,
    selectOriginalImage,
    selectActiveOperation,
    selectIsComplete,
    selectHasHistory,
    selectIsStockImage,
  ],
  (activeImage, originalImage, activeOperation, isComplete) => ({
    activeImage,
    originalImage,
    activeOperation,
    isComplete,
  })
)
