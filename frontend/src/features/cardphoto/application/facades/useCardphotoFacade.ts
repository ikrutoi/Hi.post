import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/store/hooks'
import {
  initCardphoto,
  uploadUserImage,
  applyFinal,
  reset,
  cancelSelection,
  resetCropLayers,
  uploadImageReady,
  selectCropFromHistory,
  removeCropId as deleteCropId,
} from '../../infrastructure/state'
import { prepareForRedux } from '@app/middleware/cardphotoHelpers'
import {
  selectCardphotoState,
  selectCardphotoIsComplete,
  selectStockImage,
  selectUserImage,
  selectAppliedImage,
  selectActiveSource,
  selectCurrentConfig,
  selectCardSize,
  selectCropQualityProgress,
  selectActiveImage,
  selectIsProcessedMode,
  selectCropIds,
} from '../../infrastructure/selectors'
import type {
  ImageMeta,
  ImageLayer,
  CropLayer,
  CardphotoState,
  WorkingConfig,
  ActiveImageSource,
} from '../../domain/types'

export type CardphotoFacade = {
  cardphotoSession: CardphotoState | null
  isComplete: boolean
  stockImage: ImageMeta | null
  userImage: ImageMeta | null
  appliedImage: ImageMeta | null
  activeSource: ActiveImageSource | null
  currentConfig: WorkingConfig | null
  cardWidth: number
  cardHeight: number
  cropQualityProgress: number
  activeImage: ImageMeta | null
  isProcessedMode: boolean
  cropIds: string[]

  init: () => void
  uploadImage: (meta: ImageMeta) => void
  setUserImage: (meta: ImageMeta) => void
  apply: (meta: ImageMeta) => void
  resetAll: () => void
  cancel: () => void
  resetLayers: (payload: {
    imageLayer: ImageLayer
    cropLayer: CropLayer
    card: WorkingConfig['card']
  }) => void
  cropFromHistory: (cropId: string) => void
  removeCropId: (cropId: string) => void
}

export const useCardphotoFacade = (): CardphotoFacade => {
  const dispatch = useAppDispatch()

  const cardphotoSession = useSelector(selectCardphotoState)
  const isComplete = useSelector(selectCardphotoIsComplete)
  const stockImage = useSelector(selectStockImage)
  const userImage = useSelector(selectUserImage)
  const appliedImage = useSelector(selectAppliedImage)
  const activeSource = useSelector(selectActiveSource)
  const currentConfig = useSelector(selectCurrentConfig)
  const { width: cardWidth, height: cardHeight } = useSelector(selectCardSize)
  const cropQualityProgress = useSelector(selectCropQualityProgress)
  const activeImage = useSelector(selectActiveImage)
  const isProcessedMode = useSelector(selectIsProcessedMode)
  const cropIds = useSelector(selectCropIds)

  const init = useCallback(() => dispatch(initCardphoto()), [dispatch])
  const uploadImage = useCallback(
    (meta: ImageMeta) => dispatch(uploadImageReady(prepareForRedux(meta))),
    [dispatch],
  )
  const setUserImage = useCallback(
    (meta: ImageMeta) => dispatch(uploadUserImage(meta)),
    [dispatch],
  )
  const apply = useCallback(
    (meta: ImageMeta) => dispatch(applyFinal(prepareForRedux(meta))),
    [dispatch],
  )
  const resetAll = useCallback(() => dispatch(reset()), [dispatch])
  const cancel = useCallback(() => dispatch(cancelSelection()), [dispatch])
  const resetLayers = useCallback(
    (payload: {
      imageLayer: ImageLayer
      cropLayer: CropLayer
      card: WorkingConfig['card']
    }) => dispatch(resetCropLayers(payload)),
    [dispatch],
  )
  const cropFromHistory = useCallback(
    (cropId: string) => dispatch(selectCropFromHistory(cropId)),
    [dispatch],
  )
  const removeCropId = useCallback(
    (cropId: string) => dispatch(deleteCropId(cropId)),
    [dispatch],
  )

  return useMemo(
    () => ({
      cardphotoSession,
      isComplete,
      stockImage,
      userImage,
      appliedImage,
      activeSource,
      currentConfig,
      cardWidth,
      cardHeight,
      cropQualityProgress,
      activeImage,
      isProcessedMode,
      cropIds,
      init,
      uploadImage,
      setUserImage,
      apply,
      resetAll,
      cancel,
      resetLayers,
      cropFromHistory,
      removeCropId,
    }),
    [
      cardphotoSession,
      isComplete,
      stockImage,
      userImage,
      appliedImage,
      activeSource,
      currentConfig,
      cardWidth,
      cardHeight,
      cropQualityProgress,
      activeImage,
      isProcessedMode,
      cropIds,
      init,
      uploadImage,
      setUserImage,
      apply,
      resetAll,
      cancel,
      resetLayers,
      cropFromHistory,
      removeCropId,
    ],
  )
}
