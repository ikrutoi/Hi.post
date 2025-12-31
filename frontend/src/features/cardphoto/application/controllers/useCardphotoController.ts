import { AppDispatch, RootState } from '@app/state'
import {
  initStockImage,
  setActiveImage,
  addOperation,
  undo,
  redo,
  reset,
  markComplete,
  cancelSelection,
  uploadImage,
} from '../../infrastructure/state/cardphotoSlice'
import {
  selectActiveImage,
  selectHistory,
  selectActiveIndex,
  selectOperations,
  selectIsComplete,
  selectHasConfirmedImage,
  selectOriginalImage,
  selectHasHistory,
  selectIsStockImage,
  selectCanUndo,
  selectCanRedo,
  selectWorkingConfig,
  selectLastApplied,
  selectOrientation,
  selectCropArea,
} from '../../infrastructure/selectors/cardphotoSelectors'
import type { ImageMeta, CropArea, Orientation } from '../../domain/types'

export const useCardphotoController = (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = {
    activeImage: selectActiveImage(getState()),
    history: selectHistory(getState()),
    activeIndex: selectActiveIndex(getState()),
    operations: selectOperations(getState()),
    isComplete: selectIsComplete(getState()),
    hasConfirmedImage: selectHasConfirmedImage(getState()),
    originalImage: selectOriginalImage(getState()),
    hasHistory: selectHasHistory(getState()),
    isStockImage: selectIsStockImage(getState()),
    canUndo: selectCanUndo(getState()),
    canRedo: selectCanRedo(getState()),
    workingConfig: selectWorkingConfig(getState()),
    lastApplied: selectLastApplied(getState()),
    orientation: selectOrientation(getState()),
    cropArea: selectCropArea(getState()),
  }

  const actions = {
    initStockImage: (image: ImageMeta) => dispatch(initStockImage(image)),
    setImage: (image: ImageMeta) => dispatch(setActiveImage(image)),
    confirmSelection: () => dispatch(markComplete()),
    cancelSelection: () => dispatch(cancelSelection()),
    addOperation: (op: any) => dispatch(addOperation(op)), // generic fallback
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
    reset: () => dispatch(reset()),
    uploadImage: (file: ImageMeta) => dispatch(uploadImage(file)),

    applyCrop: (area: CropArea, orientation: Orientation) =>
      dispatch(
        addOperation({
          type: 'apply',
          payload: {
            snapshot: { crop: area, orientation },
            orientation,
          },
        })
      ),

    rotateRight: () => {
      const current = selectOrientation(getState())
      const next: Orientation = ((current + 90) % 360) as Orientation
      dispatch(
        addOperation({
          type: 'apply',
          payload: {
            snapshot: { ...selectWorkingConfig(getState()), orientation: next },
            orientation: next,
          },
        })
      )
    },

    rotateLeft: () => {
      const current = selectOrientation(getState())
      const next: Orientation = ((current + 270) % 360) as Orientation
      dispatch(
        addOperation({
          type: 'apply',
          payload: {
            snapshot: { ...selectWorkingConfig(getState()), orientation: next },
            orientation: next,
          },
        })
      )
    },

    resetToOriginal: () => dispatch(reset()),
  }

  return { state, actions }
}
