import { useDispatch, useSelector } from 'react-redux'
import {
  setActiveImage,
  addOperation,
  undo,
  redo,
  reset,
  markComplete,
  cancelSelection,
  uploadImage,
  openFileDialog,
  resetFileDialog,
  cancelFileDialog,
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

export const useCardphotoFacade = () => {
  const dispatch = useDispatch()

  const state = {
    activeImage: useSelector(selectActiveImage),
    history: useSelector(selectHistory),
    activeIndex: useSelector(selectActiveIndex),
    operations: useSelector(selectOperations),
    isComplete: useSelector(selectIsComplete),
    hasConfirmedImage: useSelector(selectHasConfirmedImage),
    originalImage: useSelector(selectOriginalImage),
    shouldOpenFileDialog: useSelector(selectShouldOpenFileDialog),
    isLoading: useSelector(selectIsLoading),
  }

  const actions = {
    setImage: (image: ImageMeta) => dispatch(setActiveImage(image)),
    confirmSelection: () => dispatch(markComplete()),
    cancelSelection: () => dispatch(cancelSelection()),
    addOperation: (op: ImageOperation) => dispatch(addOperation(op)),
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
    reset: () => dispatch(reset()),

    uploadImage: (imageMeta: ImageMeta) => dispatch(uploadImage(imageMeta)),

    openFileDialog: () => dispatch(openFileDialog()),
    resetFileDialog: () => dispatch(resetFileDialog()),
    cancelFileDialog: () => dispatch(cancelFileDialog()),
    markLoading: () => dispatch(markLoading()),
  }

  const helpers = {
    canUndo: () => state.activeIndex >= 0,
    canRedo: () => state.activeIndex < state.operations.length - 1,
    isReadyForMiniSection: () => state.hasConfirmedImage && state.isComplete,
  }

  return { state, actions, helpers }
}
