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
} from '../../infrastructure/state/cardphotoSlice'
import {
  selectActiveImage,
  selectHistory,
  selectActiveIndex,
  selectOperations,
  selectIsComplete,
  selectHasConfirmedImage,
  selectOriginalImage,
} from '../../infrastructure/selectors/cardphotoSelectors'
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
  }

  const actions = {
    setImage: (image: ImageMeta) => dispatch(setActiveImage(image)),
    confirmSelection: () => dispatch(markComplete()),
    cancelSelection: () => dispatch(cancelSelection()),
    addOperation: (op: ImageOperation) => dispatch(addOperation(op)),
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
    reset: () => dispatch(reset()),
    uploadImage: (file: ImageMeta) => dispatch(uploadImage(file)),
  }

  const helpers = {
    canUndo: () => state.activeIndex >= 0,
    canRedo: () => state.activeIndex < state.operations.length - 1,
    isReadyForMiniSection: () => state.hasConfirmedImage && state.isComplete,
  }

  return { state, actions, helpers }
}
