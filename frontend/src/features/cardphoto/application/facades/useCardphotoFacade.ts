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
  selectWorkingConfig,
  selectLastApplied,
  selectOrientation,
  selectCropArea,
} from '../../infrastructure/selectors/cardphotoSelectors'
import type { ImageMeta, CropArea, Orientation } from '../../domain/types'

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
    workingConfig: useSelector(selectWorkingConfig),
    lastApplied: useSelector(selectLastApplied),
    orientation: useSelector(selectOrientation),
    cropArea: useSelector(selectCropArea),
  }

  const actions = {
    initCardphoto: () => dispatch(initCardphoto()),
    initStockImage: (image: ImageMeta) => dispatch(initStockImage(image)),
    setImage: (image: ImageMeta) => dispatch(setActiveImage(image)),
    confirmSelection: () => dispatch(markComplete()),
    cancelSelection: () => dispatch(cancelSelection()),
    addOperation: (op: any) => dispatch(addOperation(op)),
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
      const current = state.orientation
      const next: Orientation = ((current + 90) % 360) as Orientation
      dispatch(
        addOperation({
          type: 'apply',
          payload: {
            snapshot: { ...state.workingConfig, orientation: next },
            orientation: next,
          },
        })
      )
    },

    rotateLeft: () => {
      const current = state.orientation
      const next: Orientation = ((current + 270) % 360) as Orientation
      dispatch(
        addOperation({
          type: 'apply',
          payload: {
            snapshot: { ...state.workingConfig, orientation: next },
            orientation: next,
          },
        })
      )
    },

    resetToOriginal: () => dispatch(reset()),
  }

  const helpers = {
    isReadyForMiniSection: () => state.hasConfirmedImage && state.isComplete,
  }

  return { state, actions, helpers }
}
