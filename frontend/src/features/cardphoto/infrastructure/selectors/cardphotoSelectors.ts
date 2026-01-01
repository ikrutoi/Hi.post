import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type {
  ImageOperation,
  WorkingConfig,
  Orientation,
} from '@cardphoto/domain/types'

const selectCardphoto = (state: RootState) => state.cardphoto

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

export const selectOriginalImage = createSelector(
  [selectHistory],
  (history) => history?.original ?? null
)

export const selectFinalImage = createSelector(
  [selectHistory],
  (history) => history?.finalImage ?? null
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
  (activeIndex) => activeIndex > 0
)

export const selectCanRedo = createSelector(
  [selectOperations, selectActiveIndex],
  (operations, activeIndex) => activeIndex < operations.length - 1
)

export const selectHasHistory = createSelector(
  [selectHistory],
  (history) => !!history
)

export const selectWorkingConfig = createSelector(
  [selectHistory],
  (history): WorkingConfig =>
    history?.workingConfig ?? { orientation: 0, crop: null }
)

export const selectOrientation = createSelector(
  [selectWorkingConfig],
  (workingConfig): Orientation => workingConfig.orientation
)

export const selectCropArea = createSelector(
  [selectWorkingConfig],
  (workingConfig) => workingConfig.crop ?? null
)

export const selectLastApplied = createSelector(
  [selectHistory],
  (history) => history?.lastApplied ?? null
)

export const selectCardphotoContext = createSelector(
  [
    selectOriginalImage,
    selectFinalImage,
    selectActiveOperation,
    selectIsComplete,
    selectHasHistory,
    selectWorkingConfig,
    selectLastApplied,
    selectOrientation,
    selectCropArea,
  ],
  (
    originalImage,
    finalImage,
    activeOperation,
    isComplete,
    hasHistory,
    workingConfig,
    lastApplied,
    orientation,
    cropArea
  ) => ({
    originalImage,
    finalImage,
    activeOperation,
    isComplete,
    hasHistory,
    workingConfig,
    lastApplied,
    orientation,
    cropArea,
  })
)
