import { useDispatch, useSelector } from 'react-redux'
import {
  initCardphoto,
  initStockImage,
  uploadUserImage,
  addOperation,
  undo,
  redo,
  applyFinal,
  reset,
  cancelSelection,
  setOrientation,
  uploadImageReady,
} from '../../infrastructure/state'
import {
  selectCardphotoState,
  selectCardphotoIsComplete,
  selectStockImage,
  selectUserImage,
  selectAppliedImage,
  selectOperations,
  selectActiveIndex,
  selectActiveOperation,
  selectCurrentConfig,
  selectCardOrientation,
  selectCropOrientation,
  selectLastOperationReason,
  selectCardSize,
  selectCropQuality,
  selectCropQualityProgress,
} from '../../infrastructure/selectors'
import type {
  ImageMeta,
  CardphotoOperation,
  WorkingConfig,
} from '../../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

export const useCardphotoController = () => {
  const dispatch = useDispatch()

  const state = useSelector(selectCardphotoState)
  const isComplete = useSelector(selectCardphotoIsComplete)
  const stockImage = useSelector(selectStockImage)
  const userImage = useSelector(selectUserImage)
  const appliedImage = useSelector(selectAppliedImage)
  const operations = useSelector(selectOperations)
  const activeIndex = useSelector(selectActiveIndex)
  const activeOperation = useSelector(selectActiveOperation)
  const currentConfig = useSelector(selectCurrentConfig)
  const quality = useSelector(selectCropQuality)
  const qualityProgress = useSelector(selectCropQualityProgress)

  const cardOrientation = useSelector(selectCardOrientation)
  const cropOrientation = useSelector(selectCropOrientation)
  const lastOperationReason = useSelector(selectLastOperationReason)
  const cardSize = useSelector(selectCardSize)

  const init = () => dispatch(initCardphoto())
  const uploadImage = (meta: ImageMeta) => dispatch(uploadImageReady(meta))
  const setStockImage = (payload: { meta: ImageMeta; config: WorkingConfig }) =>
    dispatch(initStockImage(payload))
  const setUserImage = (meta: ImageMeta) => dispatch(uploadUserImage(meta))
  const addOp = (op: CardphotoOperation) => dispatch(addOperation(op))
  const undoOp = () => dispatch(undo())
  const redoOp = () => dispatch(redo())
  const apply = (meta: ImageMeta) => dispatch(applyFinal(meta))
  const resetAll = () => dispatch(reset())
  const cancel = () => dispatch(cancelSelection())
  const rotateCard = (orientation: LayoutOrientation) =>
    dispatch(setOrientation(orientation))

  return {
    state,
    isComplete,
    stockImage,
    userImage,
    appliedImage,
    operations,
    activeIndex,
    activeOperation,
    currentConfig,
    cardOrientation,
    cropOrientation,
    lastOperationReason,
    cardSize,
    quality,
    qualityProgress,

    init,
    uploadImage,
    setStockImage,
    setUserImage,
    addOp,
    undoOp,
    redoOp,
    apply,
    resetAll,
    cancel,
    rotateCard,
  }
}
