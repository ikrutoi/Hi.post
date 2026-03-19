import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initCardphoto,
  // initStockImage,
  uploadUserImage,
  addOperation,
  applyFinal,
  reset,
  cancelSelection,
  uploadImageReady,
  selectCropFromHistory,
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
  selectLastOperationReason,
  selectCardSize,
  selectCropQuality,
  selectCropQualityProgress,
  selectActiveImage,
  selectIsProcessedMode,
} from '../../infrastructure/selectors'
import type {
  ImageMeta,
  CardphotoOperation,
  WorkingConfig,
} from '../../domain/types'
export const useCardphotoController = () => {
  const dispatch = useAppDispatch()

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
  const activeImage = useSelector(selectActiveImage)
  const processedMode = useSelector(selectIsProcessedMode)

  const lastOperationReason = useSelector(selectLastOperationReason)
  const cardSize = useSelector(selectCardSize)

  const init = () => dispatch(initCardphoto())
  const uploadImage = (meta: ImageMeta) => dispatch(uploadImageReady(meta))
  // const setStockImage = (payload: { meta: ImageMeta; config: WorkingConfig }) =>
  //   dispatch(initStockImage(payload))
  const setUserImage = (meta: ImageMeta) => dispatch(uploadUserImage(meta))
  const addOp = (op: CardphotoOperation) => dispatch(addOperation(op))
  const apply = (meta: ImageMeta) => dispatch(applyFinal(meta))
  const resetAll = () => dispatch(reset())
  const cancel = () => dispatch(cancelSelection())
  const cropFromHistory = (cropId: string) =>
    dispatch(selectCropFromHistory(cropId))
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
    lastOperationReason,
    cardSize,
    quality,
    qualityProgress,
    activeImage,
    processedMode,

    init,
    uploadImage,
    // setStockImage,
    setUserImage,
    addOp,
    apply,
    resetAll,
    cancel,
    cropFromHistory,
  }
}
