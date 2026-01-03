import { AppDispatch, RootState } from '@app/state'
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

export const useCardphotoController = (
  dispatch: AppDispatch,
  getState: () => RootState
) => {
  const state = {
    history: selectHistory(getState()),
    activeIndex: selectActiveIndex(getState()),
    operations: selectOperations(getState()),
    isComplete: selectIsComplete(getState()),
    originalImage: selectOriginalImage(getState()),
    finalImage: selectFinalImage(getState()),
    hasHistory: selectHasHistory(getState()),
    canUndo: selectCanUndo(getState()),
    canRedo: selectCanRedo(getState()),
    workingConfig: selectWorkingConfig(getState()),
    lastApplied: selectLastApplied(getState()),
    orientation: selectOrientation(getState()),
    cropArea: selectCropArea(getState()),
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
