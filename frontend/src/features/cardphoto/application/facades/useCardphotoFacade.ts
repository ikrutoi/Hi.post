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
} from '../../infrastructure/state'
import { prepareForRedux } from '@app/middleware/cardphotoHelpers'
import {
  selectCardphotoState,
  selectCardphotoIsComplete,
  selectStockImage,
  selectUserImage,
  selectAppliedImage,
  selectActiveSource,
  selectCardphotoAssetConfig,
  selectCardSize,
  selectCropQualityProgress,
  selectActiveImage,
  selectIsProcessedMode,
  selectCardphotoAssetToolbar,
} from '../../infrastructure/selectors'
import type {
  ImageMeta,
  ImageLayer,
  CropLayer,
  CardphotoState,
  CardphotoAssetToolbar,
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
  assetConfig: WorkingConfig | null
  cardWidth: number
  cardHeight: number
  cropQualityProgress: number
  activeImage: ImageMeta | null
  isProcessedMode: boolean
  /** Toolbar section for the active asset (Redux `assetToolbar`). */
  assetToolbar: CardphotoAssetToolbar

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
}

export const useCardphotoFacade = (): CardphotoFacade => {
  const dispatch = useAppDispatch()

  const cardphotoSession = useSelector(selectCardphotoState)
  const isComplete = useSelector(selectCardphotoIsComplete)
  const stockImage = useSelector(selectStockImage)
  const userImage = useSelector(selectUserImage)
  const appliedImage = useSelector(selectAppliedImage)
  const activeSource = useSelector(selectActiveSource)
  const assetConfig = useSelector(selectCardphotoAssetConfig)
  const { width: cardWidth, height: cardHeight } = useSelector(selectCardSize)
  const cropQualityProgress = useSelector(selectCropQualityProgress)
  const activeImage = useSelector(selectActiveImage)
  const isProcessedMode = useSelector(selectIsProcessedMode)
  const assetToolbar = useSelector(selectCardphotoAssetToolbar)

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
  return useMemo(
    () => ({
      cardphotoSession,
      isComplete,
      stockImage,
      userImage,
      appliedImage,
      activeSource,
      assetConfig,
      cardWidth,
      cardHeight,
      cropQualityProgress,
      activeImage,
      isProcessedMode,
      assetToolbar,
      init,
      uploadImage,
      setUserImage,
      apply,
      resetAll,
      cancel,
      resetLayers,
    }),
    [
      cardphotoSession,
      isComplete,
      stockImage,
      userImage,
      appliedImage,
      activeSource,
      assetConfig,
      cardWidth,
      cardHeight,
      cropQualityProgress,
      activeImage,
      isProcessedMode,
      assetToolbar,
      init,
      uploadImage,
      setUserImage,
      apply,
      resetAll,
      cancel,
      resetLayers,
    ],
  )
}
