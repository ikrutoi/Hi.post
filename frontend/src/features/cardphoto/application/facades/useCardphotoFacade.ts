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
  resetCropLayers,
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
} from '../../infrastructure/selectors'
import type {
  ImageMeta,
  CardphotoOperation,
  CardphotoState,
  WorkingConfig,
} from '../../domain/types'
import type { LayoutOrientation } from '@layout/domain/types'

export interface CardphotoFacade {
  state: {
    state: CardphotoState | null
    isComplete: boolean
    stockImage: ImageMeta | null
    userImage: ImageMeta | null
    appliedImage: ImageMeta | null
    operations: CardphotoOperation[]
    activeIndex: number
    activeOperation: CardphotoOperation | null
    currentConfig: WorkingConfig | null
    cardOrientation: LayoutOrientation
    cropOrientation: LayoutOrientation
    lastOperationReason: string | null
    cardSize: { width: number; height: number }
  }
  actions: {
    init: () => void
    uploadImage: (meta: ImageMeta) => void
    setStockImage: (payload: { meta: ImageMeta; config: WorkingConfig }) => void
    setUserImage: (meta: ImageMeta) => void
    addOp: (op: CardphotoOperation) => void
    undoOp: () => void
    redoOp: () => void
    apply: (meta: ImageMeta) => void
    resetAll: () => void
    cancel: () => void
    resetLayers: (payload: {
      imageLayer: any
      cropLayer: any
      card: WorkingConfig['card']
    }) => void
    rotateCard: (orientation: LayoutOrientation) => void
  }
}

export const useCardphotoFacade = (): CardphotoFacade => {
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
  const resetLayers = (payload: {
    imageLayer: any
    cropLayer: any
    card: WorkingConfig['card']
  }) => dispatch(resetCropLayers(payload))
  const rotateCard = (orientation: LayoutOrientation) =>
    dispatch(setOrientation(orientation))

  return {
    state: {
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
    },
    actions: {
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
      resetLayers,
      rotateCard,
    },
  }
}
