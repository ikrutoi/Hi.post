import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  initCardphoto,
  // initStockImage,
  uploadUserImage,
  addOperation,
  undo,
  redo,
  applyFinal,
  reset,
  cancelSelection,
  resetCropLayers,
  setOrientation,
  uploadImageReady,
  selectCropFromHistory,
  removeCropId as deleteCropId,
} from '../../infrastructure/state'
import {
  selectCardphotoState,
  selectCardphotoIsComplete,
  selectStockImage,
  selectUserImage,
  // selectGalleryImage,
  selectAppliedImage,
  selectOperations,
  selectActiveIndex,
  selectActiveOperation,
  selectActiveSource,
  selectCurrentConfig,
  selectCardOrientation,
  selectCropOrientation,
  selectLastOperationReason,
  selectCardSize,
  selectCropQuality,
  selectCropQualityProgress,
  selectActiveImage,
  selectIsProcessedMode,
  selectCropIds,
  selectCardphotoSessionRecord,

  // selectCropIdsReversed,
} from '../../infrastructure/selectors'
import type {
  ImageMeta,
  ImageLayer,
  CropLayer,
  CardphotoOperation,
  CardphotoState,
  WorkingConfig,
  QualityLevel,
  ImageSource,
} from '../../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

export interface CardphotoFacade {
  state: {
    state: CardphotoState | null
    isComplete: boolean
    stockImage: ImageMeta | null
    userImage: ImageMeta | null
    // galleryImage: ImageMeta | null
    appliedImage: ImageMeta | null
    operations: CardphotoOperation[]
    activeIndex: number
    activeOperation: CardphotoOperation | null
    activeSource: ImageSource | null
    currentConfig: WorkingConfig | null
    cardOrientation: LayoutOrientation
    cropOrientation: LayoutOrientation
    lastOperationReason: string | null
    cardSize: { width: number; height: number }
    quality: QualityLevel
    qualityProgress: number
    activeImage: ImageMeta | null
    processedMode: boolean
    cropIds: string[]
    // cropIdsReversed: string[]
  }
  actions: {
    init: () => void
    uploadImage: (meta: ImageMeta) => void
    // setStockImage: (payload: { meta: ImageMeta; config: WorkingConfig }) => void
    setUserImage: (meta: ImageMeta) => void
    addOp: (op: CardphotoOperation) => void
    undoOp: () => void
    redoOp: () => void
    apply: (meta: ImageMeta) => void
    resetAll: () => void
    cancel: () => void
    resetLayers: (payload: {
      imageLayer: ImageLayer
      cropLayer: CropLayer
      card: WorkingConfig['card']
    }) => void
    rotateCard: (orientation: LayoutOrientation) => void
    cropFromHistory: (cropId: string) => void
    removeCropId: (cropId: string) => void
  }
}

export const useCardphotoFacade = (): CardphotoFacade => {
  const dispatch = useAppDispatch()

  const stateRaw = useSelector(selectCardphotoState)
  const isComplete = useSelector(selectCardphotoIsComplete)
  const stockImage = useSelector(selectStockImage)
  const userImage = useSelector(selectUserImage)
  const appliedImage = useSelector(selectAppliedImage)
  const operations = useSelector(selectOperations)
  const activeIndex = useSelector(selectActiveIndex)
  const activeOperation = useSelector(selectActiveOperation)
  const activeSource = useSelector(selectActiveSource)
  const currentConfig = useSelector(selectCurrentConfig)
  const cardOrientation = useSelector(selectCardOrientation)
  const cropOrientation = useSelector(selectCropOrientation)
  const lastOperationReason = useSelector(selectLastOperationReason)
  const cardSize = useSelector(selectCardSize)
  const quality = useSelector(selectCropQuality)
  const qualityProgress = useSelector(selectCropQualityProgress)
  const activeImage = useSelector(selectActiveImage)
  const processedMode = useSelector(selectIsProcessedMode)
  const cropIds = useSelector(selectCropIds)

  const state = useMemo(
    () => ({
      state: stateRaw,
      isComplete,
      stockImage,
      userImage,
      appliedImage,
      operations,
      activeIndex,
      activeOperation,
      activeSource,
      currentConfig,
      cardOrientation,
      cropOrientation,
      lastOperationReason,
      cardSize,
      quality,
      qualityProgress,
      activeImage,
      processedMode,
      cropIds,
    }),
    [
      stateRaw,
      isComplete,
      stockImage,
      userImage,
      appliedImage,
      operations,
      activeIndex,
      activeOperation,
      activeSource,
      currentConfig,
      cardOrientation,
      cropOrientation,
      lastOperationReason,
      cardSize,
      quality,
      qualityProgress,
      activeImage,
      processedMode,
      cropIds,
    ],
  )

  const actions = useMemo(
    () => ({
      init: () => dispatch(initCardphoto()),
      uploadImage: (meta: ImageMeta) => dispatch(uploadImageReady(meta)),
      setUserImage: (meta: ImageMeta) => dispatch(uploadUserImage(meta)),
      addOp: (op: CardphotoOperation) => dispatch(addOperation(op)),
      undoOp: () => dispatch(undo()),
      redoOp: () => dispatch(redo()),
      apply: (meta: ImageMeta) => dispatch(applyFinal(meta)),
      resetAll: () => dispatch(reset()),
      cancel: () => dispatch(cancelSelection()),
      resetLayers: (payload: any) => dispatch(resetCropLayers(payload)),
      rotateCard: (orientation: LayoutOrientation) =>
        dispatch(setOrientation(orientation)),
      cropFromHistory: (cropId: string) =>
        dispatch(selectCropFromHistory(cropId)),
      removeCropId: (cropId: string) => dispatch(deleteCropId(cropId)),
    }),
    [dispatch],
  )

  return { state, actions }
}
