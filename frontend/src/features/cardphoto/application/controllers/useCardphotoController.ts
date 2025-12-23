import { AppDispatch, RootState } from '@app/state'
import {
  setActiveImage,
  addOperation,
  undo,
  redo,
  reset,
  markComplete,
  cancelSelection,
} from '../../infrastructure/state'
import {
  selectActiveImage,
  selectHistory,
  selectActiveIndex,
  selectOperations,
  selectIsComplete,
  selectHasConfirmedImage,
  selectOriginalImage,
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
  }

  const actions = {
    setImage: (image: ImageMeta) => dispatch(setActiveImage(image)),
    confirmSelection: () => dispatch(markComplete()),
    cancelSelection: () => dispatch(cancelSelection()),
    addOperation: (op: ImageOperation) => dispatch(addOperation(op)),
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
    reset: () => dispatch(reset()),
  }

  return { state, actions }
}
