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
} from '../../infrastructure/selectors/cardphotoSelectors'
import type { ImageMeta, ImageOperation, CropArea } from '../../domain/types'

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
  }

  const actions = {
    initStockImage: (image: ImageMeta) => dispatch(initStockImage(image)),
    setImage: (image: ImageMeta) => dispatch(setActiveImage(image)),
    confirmSelection: () => dispatch(markComplete()),
    cancelSelection: () => dispatch(cancelSelection()),
    addOperation: (op: ImageOperation) => dispatch(addOperation(op)),
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
    reset: () => dispatch(reset()),
    uploadImage: (file: ImageMeta) => dispatch(uploadImage(file)),

    applyCrop: (area: CropArea) =>
      dispatch(addOperation({ type: 'crop', area })),
    applyRotate: (angle: number) =>
      dispatch(addOperation({ type: 'rotate', angle })),
    applyScale: (factor: number) =>
      dispatch(addOperation({ type: 'scale', factor })),

    resetToOriginal: () => dispatch(reset()),
  }

  return { state, actions }
}
