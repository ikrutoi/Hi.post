import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initCardphoto,
  // initStockImage,
  uploadUserImage,
  applyFinal,
  reset,
  cancelSelection,
  uploadImageReady,
} from '../../infrastructure/state'
import {
  selectCardphotoState,
  selectCardphotoIsComplete,
  selectStockImage,
  selectUserImage,
  selectAppliedImage,
  selectCurrentConfig,
  selectCardSize,
  selectCropQualityProgress,
  selectActiveImage,
  selectIsProcessedMode,
} from '../../infrastructure/selectors'
import type {
  ImageMeta,
  WorkingConfig,
} from '../../domain/types'
import { prepareForRedux } from '@app/middleware/cardphotoHelpers'
export const useCardphotoController = () => {
  const dispatch = useAppDispatch()

  const state = useSelector(selectCardphotoState)
  const isComplete = useSelector(selectCardphotoIsComplete)
  const stockImage = useSelector(selectStockImage)
  const userImage = useSelector(selectUserImage)
  const appliedImage = useSelector(selectAppliedImage)
  const currentConfig = useSelector(selectCurrentConfig)
  const qualityProgress = useSelector(selectCropQualityProgress)
  const activeImage = useSelector(selectActiveImage)
  const processedMode = useSelector(selectIsProcessedMode)

  const cardSize = useSelector(selectCardSize)

  const init = () => dispatch(initCardphoto())
  const uploadImage = (meta: ImageMeta) =>
    dispatch(uploadImageReady(prepareForRedux(meta)))
  // const setStockImage = (payload: { meta: ImageMeta; config: WorkingConfig }) =>
  //   dispatch(initStockImage(payload))
  const setUserImage = (meta: ImageMeta) => dispatch(uploadUserImage(meta))
  const apply = (meta: ImageMeta) =>
    dispatch(applyFinal(prepareForRedux(meta)))
  const resetAll = () => dispatch(reset())
  const cancel = () => dispatch(cancelSelection())
  return {
    state,
    isComplete,
    stockImage,
    userImage,
    appliedImage,
    currentConfig,
    cardSize,
    qualityProgress,
    activeImage,
    processedMode,

    init,
    uploadImage,
    // setStockImage,
    setUserImage,
    apply,
    resetAll,
    cancel,
  }
}
