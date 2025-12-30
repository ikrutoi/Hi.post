import { useDispatch, useSelector } from 'react-redux'
import {
  initCardphoto,
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
    hasHistory: useSelector(selectHasHistory),
    isStockImage: useSelector(selectIsStockImage),
    canUndo: useSelector(selectCanUndo),
    canRedo: useSelector(selectCanRedo),
  }

  const actions = {
    initCardphoto: () => dispatch(initCardphoto()),
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
  }

  const helpers = {
    isReadyForMiniSection: () => state.hasConfirmedImage && state.isComplete,
  }

  return { state, actions, helpers }
}
