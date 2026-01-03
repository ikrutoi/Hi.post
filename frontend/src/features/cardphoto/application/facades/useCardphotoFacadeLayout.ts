import { useDispatch, useSelector } from 'react-redux'
import {
  initCardphoto,
  initStockImage,
  setFinalImage,
  addOperation,
  undo,
  redo,
  reset,
  markComplete,
  cancelSelection,
  uploadImage,
  updateCrop,
  clearCrop,
  resetCrop,
} from '../../infrastructure/state'
import {
  selectHistory,
  selectActiveIndex,
  selectOperations,
  selectIsComplete,
  selectOriginalImage,
  selectFinalImage,
  selectHasHistory,
  selectCanUndo,
  selectCanRedo,
  selectWorkingConfig,
  selectLastApplied,
  selectOrientation,
  selectCropArea,
} from '../../infrastructure/selectors'
import type { ImageMeta, CropArea, Orientation } from '../../domain/types'

export const useCardphotoFacade = () => {
  const dispatch = useDispatch()

  const state = {
    history: useSelector(selectHistory),
    activeIndex: useSelector(selectActiveIndex),
    operations: useSelector(selectOperations),
    isComplete: useSelector(selectIsComplete),
    originalImage: useSelector(selectOriginalImage),
    finalImage: useSelector(selectFinalImage),
    hasHistory: useSelector(selectHasHistory),
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
    setFinalImage: (image: ImageMeta) => dispatch(setFinalImage(image)),
    confirmSelection: () => dispatch(markComplete()),
    cancelSelection: () => dispatch(cancelSelection()),
    addOperation: (op: any) => dispatch(addOperation(op)),
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo()),
    reset: () => dispatch(reset()),
    uploadImage: (file: ImageMeta) => dispatch(uploadImage(file)),

    // новые экшены для кропа
    updateCrop: (area: Partial<CropArea>) => dispatch(updateCrop(area)),
    clearCrop: () => dispatch(clearCrop()),
    resetCrop: (params: {
      imageWidth: number
      imageHeight: number
      aspectRatio: number
      imageAspectRatio: number
      imageLeft: number
      imageTop: number
      imageId: string
    }) => dispatch(resetCrop(params)),

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
    isReadyForMiniSection: () => !!state.finalImage && state.isComplete,
  }

  return { state, actions, helpers }
}
