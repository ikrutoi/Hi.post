import { AppDispatch, RootState } from '@app/state'
import {
  setActiveImage,
  addOperation,
  undo,
  redo,
  reset,
  markComplete,
  cancelSelection,
  openFileDialog,
  resetFileDialog,
  uploadImage,
  markLoading,
} from '../../infrastructure/state'
import {
  selectActiveImage,
  selectHistory,
  selectActiveIndex,
  selectOperations,
  selectIsComplete,
  selectHasConfirmedImage,
  selectOriginalImage,
  selectShouldOpenFileDialog,
  selectIsLoading,
} from '../../infrastructure/selectors'
import type { ImageMeta, ImageOperation } from '../../domain/types'

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
    shouldOpenFileDialog: selectShouldOpenFileDialog(getState()),
    isLoading: selectIsLoading(getState()),
  }

  const actions = {
    setImage: (image: ImageMeta) => dispatch(setActiveImage(image)),
    confirmSelection: () => dispatch(markComplete()),
    cancelSelection: () => dispatch(cancelSelection()),
    addOperation: (op: ImageOperation) => dispatch(addOperation(op)),
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
    reset: () => dispatch(reset()),

    openFileDialog: () => dispatch(openFileDialog()),
    resetFileDialog: () => dispatch(resetFileDialog()),
    uploadImage: (file: ImageMeta) => dispatch(uploadImage(file)),
    markLoading: () => dispatch(markLoading()),
  }

  return { state, actions }
}
