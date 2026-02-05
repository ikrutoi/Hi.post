import { call, delay, put, select, fork, takeLatest } from 'redux-saga/effects'
import { PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import type { SagaIterator } from 'redux-saga'
import { RootState } from '../state'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  addOperation,
  applyFinal,
  type CardphotoSliceState,
  markLoading,
  markLoaded,
  addCropId,
  setProcessedImage,
  removeCropId,
  clearAllCrops,
  removeUserImage,
  setActiveSource,
  hydrateEditor,
} from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import {
  selectCurrentConfig,
  selectCardphotoState,
  selectActiveImage,
  selectIsCropFull,
} from '@cardphoto/infrastructure/selectors'
import { applyBounds } from '@cardphoto/application/helpers'
import { updateCropToolbarState } from './cardphotoHelpers'
import {
  getCroppedBase64,
  transformCropForOrientation,
  calculateCropQuality,
  dispatchQualityUpdate,
} from '@cardphoto/application/helpers'
import { setCardOrientation, setSizeCard } from '@layout/infrastructure/state'
import { rebuildConfigFromMeta } from './cardphotoProcessSaga'
import {
  selectSizeCard,
  selectViewportSize,
} from '@layout/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  fitImageToCard,
  createInitialCropLayer,
  createFullCropLayer,
} from '@cardphoto/application/utils'
import { getCroppedImg, loadAsyncImage } from '@cardphoto/application/hooks'
import { roundTo } from '@shared/utils/layout'
import { syncToolbarContext } from './cardphotoToolbarSaga'
import type {
  SizeCard,
  ViewportSizeState,
  LayoutOrientation,
} from '@layout/domain/types'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type {
  WorkingConfig,
  ImageMeta,
  ImageLayer,
  CardphotoOperation,
  CardLayer,
  CardphotoState,
  ImageRotation,
  CropLayer,
  ImageSource,
} from '@cardphoto/domain/types'
import { prepareForRedux } from './cardphotoHelpers'

export function* handleCropAction() {
  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto'),
  )
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config) return

  const isActivating = toolbarState.crop.state === 'enabled'

  if (isActivating) {
    yield call(updateCropToolbarState, 'active', toolbarState)

    yield call(syncCropFullIcon, {
      forceActive: true,
      customConfig: config,
    })
  } else {
    yield call(updateCropToolbarState, 'enabled', toolbarState)
  }
}

export function* handleCropFullAction(): SagaIterator {
  const state = (yield select(selectCardphotoState)) as CardphotoState
  if (!state?.currentConfig) return
  const originalImage: ImageMeta = yield select(selectActiveImage)

  const { image, card } = state.currentConfig

  const rawFullCrop = createFullCropLayer(image, card)
  const fullCrop = applyBounds(rawFullCrop, image, card.orientation)

  const { quality, qualityProgress } = calculateCropQuality(
    fullCrop.meta,
    image,
    originalImage,
    card.orientation,
  )

  const newConfig: WorkingConfig = {
    ...state.currentConfig,
    crop: {
      ...fullCrop,
      meta: {
        ...fullCrop.meta,
        quality,
        qualityProgress,
      },
    },
  }

  const op: CardphotoOperation = {
    type: 'operation',
    payload: {
      config: newConfig,
      reason: 'cropFull',
    },
  }
  yield put(addOperation(op))
}

export function* syncCropFullIcon(params?: {
  forceActive?: boolean
  customConfig?: WorkingConfig
}): SagaIterator {
  if (!params) {
    yield delay(0)
  }

  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto'),
  )

  const currentStatus = params?.forceActive ? 'active' : toolbarState.crop.state

  if (currentStatus !== 'active') return

  let isFull: boolean
  if (params?.customConfig) {
    isFull = yield select((state: RootState) =>
      selectIsCropFull.resultFunc(params.customConfig!),
    )
  } else {
    isFull = yield select(selectIsCropFull)
  }

  yield* updateCropToolbarState('active', toolbarState, { isFull })
}

export function* handleOrientationAction() {
  const sizeCard: SizeCard = yield select(selectSizeCard)
  const newOrientation: LayoutOrientation =
    sizeCard.orientation === 'portrait' ? 'landscape' : 'portrait'

  const viewportSize: ViewportSizeState = yield select(selectViewportSize)
  const viewportHeight = viewportSize?.height ?? sizeCard.height

  yield put(setCardOrientation({ orientation: newOrientation, viewportHeight }))

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'orientation',
      value: newOrientation,
    }),
  )
}

export function* handleImageLayerUpdate() {
  // const sizeCard: SizeCard = yield select(selectSizeCard)
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  // const originalImage: ImageMeta = yield select(selectActiveImage)

  if (!config || !config.image?.meta) return

  console.log('handleImageLayerUpdate--->>>', config.image.meta)
  const newConfig: WorkingConfig = yield call(
    rebuildConfigFromMeta,
    config.image.meta,
    'user',
  )

  // const newImageLayer: ImageLayer = fitImageToCard(
  //   config.image.meta,
  //   sizeCard,
  //   config.image.orientation,
  //   config.image.meta.isCropped,
  // )
  // const newCropLayer = createInitialCropLayer(
  //   newImageLayer,
  //   sizeCard,
  //   originalImage,
  // )
  // const newConfig: WorkingConfig = {
  //   card: sizeCard,
  //   image: newImageLayer,
  //   crop: newCropLayer,
  // }

  const op: CardphotoOperation = {
    type: 'operation',
    payload: { config: newConfig, reason: 'rotateCard' },
  }

  yield put(addOperation(op))
}

export function* handleCardOrientation(): SagaIterator {
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config) return

  const toolbarState = yield select(selectToolbarSectionState('cardphoto'))
  const isCropActive = toolbarState.crop.state === 'active'

  const originalImage: ImageMeta = yield select(selectActiveImage)

  if (isCropActive) {
    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'crop',
        value: 'disabled',
      }),
    )
  }

  const newOrientation: LayoutOrientation =
    config.card.orientation === 'portrait' ? 'landscape' : 'portrait'

  const ratio = config.card.aspectRatio

  console.log('newOrientation ratio', ratio)

  console.log('handleCardOrientation--->>>', originalImage)

  const newConfig: WorkingConfig = yield call(
    rebuildConfigFromMeta,
    originalImage,
    'user',
    newOrientation,
  )

  const op: CardphotoOperation = {
    type: 'operation',
    payload: { config: newConfig, reason: 'rotateCard' },
  }

  // console.log('handleCardOrientation newCardLayer', newCardLayer)

  // yield put(setSizeCard(newConfig.card))
  yield put(addOperation(op))

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'orientation',
      value: newOrientation,
    }),
  )

  const resultCropState = isCropActive ? 'active' : 'enabled'
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'crop',
      value: resultCropState,
    }),
  )

  if (isCropActive) {
    yield call(syncCropFullIcon, {
      forceActive: true,
      customConfig: newConfig,
    })
  }
}

function rotateRight(r: ImageRotation): ImageRotation {
  return ((r + 90) % 360) as ImageRotation
}

function rotateLeft(r: ImageRotation): ImageRotation {
  return ((r - 90 + 360) % 360) as ImageRotation
}

export function* handleImageRotate(
  key: 'imageRotateLeft' | 'imageRotateRight',
): SagaIterator {
  const state = yield select(selectCardphotoState)
  const originalImage: ImageMeta = yield select(selectActiveImage)

  if (!state?.currentConfig || !originalImage) return

  const currentRotation = state.currentConfig.image.rotation ?? 0
  const nextRotation =
    key === 'imageRotateRight'
      ? rotateRight(currentRotation)
      : rotateLeft(currentRotation)

  const config: WorkingConfig = yield call(
    rebuildConfigFromMeta,
    originalImage,
    'user',
    undefined,
    nextRotation,
  )

  console.log('handleImageRotate config', config)

  const op: CardphotoOperation = {
    type: 'operation',
    payload: {
      config,
      reason: 'rotateImage',
    },
  }

  yield put(addOperation(op))
}

export function* handleCropConfirm(): SagaIterator {
  const state: CardphotoState = yield select(selectCardphotoState)
  const config = state.currentConfig
  const thumbConfigWidth = 150

  if (!config || !config.crop || !config.image.meta.url) return

  try {
    yield put(markLoading())

    const img: HTMLImageElement = yield call(
      loadAsyncImage,
      config.image.meta.url,
    )

    const scaleX = img.naturalWidth / config.image.meta.width
    const scaleY = img.naturalHeight / config.image.meta.height

    const realCrop: CropLayer = {
      ...config.crop,
      x: roundTo(Math.abs((config.crop.x - config.image.left) * scaleX), 2),
      y: roundTo(Math.abs((config.crop.y - config.image.top) * scaleY), 2),
      meta: {
        ...config.crop.meta,
        width: Math.floor(config.crop.meta.width * scaleX),
        height: Math.floor(config.crop.meta.height * scaleY),
      },
    }

    const { full, thumb, thumbHeight } = yield call(
      getCroppedImg,
      img,
      realCrop,
      thumbConfigWidth,
    )

    const fullUrl = URL.createObjectURL(full)
    const thumbUrl = URL.createObjectURL(thumb)
    const id = nanoid()

    const finalImageMeta: ImageMeta = {
      id,
      source: 'processed',
      url: fullUrl,
      width: realCrop.meta.width,
      height: realCrop.meta.height,
      full: {
        blob: full,
        url: fullUrl,
        width: realCrop.meta.width,
        height: realCrop.meta.height,
      },
      thumbnail: {
        blob: thumb,
        url: thumbUrl,
        width: thumbConfigWidth,
        height: thumbHeight,
      },
      imageAspectRatio: realCrop.meta.aspectRatio,
      isCropped: true,
      timestamp: Date.now(),
      parentImageId: config.image.meta.id,
      orientation: config.card.orientation,
      rotation: 0,
    }

    console.log('handleCropConfirm finalImageMeta', finalImageMeta)

    yield call(storeAdapters.cropImages.put, finalImageMeta)

    const reduxMeta = prepareForRedux(finalImageMeta)
    yield put(setProcessedImage(reduxMeta))
    yield put(applyFinal(reduxMeta))
    yield put(addCropId(id))

    console.log('handleCropConfirm--->>>', reduxMeta)
    const newConfig: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      reduxMeta,
      'processed',
    )

    yield put(
      addOperation({
        type: 'operation',
        payload: { config: newConfig, reason: 'applyCrop' },
      }),
    )

    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'crop',
        value: 'enabled',
      }),
    )
    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'cropCheck',
        value: 'disabled',
      }),
    )
  } catch (error) {
    console.error('Error crop:', error)
  } finally {
    yield put(markLoaded())
  }
}

// function* rebuildConfigFromMeta(meta: ImageMeta) {
//   const card: CardLayer = yield select(selectSizeCard)
//   const imageLayer = fitImageToCard(meta, card, 0, true)
//   const cropLayer = createInitialCropLayer(imageLayer, card, meta)

//   yield put(
//     addOperation({
//       type: 'operation',
//       payload: {
//         config: { card, image: imageLayer, crop: cropLayer },
//         reason: 'init',
//       },
//     }),
//   )
// }

export function* handleDeleteImageSaga(
  id: string | undefined,
  source: ImageSource | null,
) {
  try {
    const state: CardphotoState = yield select(selectCardphotoState)
    const stockImage = state.base.stock.image

    if (source === 'processed' && id) {
      const currentIndex = state.cropIds.indexOf(id)

      yield call(storeAdapters.cropImages.deleteById, id)

      const remainingIds = state.cropIds.filter((cropId) => cropId !== id)

      yield put(removeCropId(id))

      if (remainingIds.length > 0) {
        const nextIdx =
          currentIndex < remainingIds.length
            ? currentIndex
            : remainingIds.length - 1
        const nextId = remainingIds[nextIdx]

        const nextCrop: ImageMeta = yield call(
          storeAdapters.cropImages.getById,
          nextId,
        )

        if (nextCrop) {
          const freshUrl = nextCrop.full?.blob
            ? URL.createObjectURL(nextCrop.full.blob)
            : nextCrop.url

          const serializable = prepareForRedux({ ...nextCrop, url: freshUrl })

          yield put(setProcessedImage(serializable))
          yield put(setActiveSource('processed'))
          yield fork(rebuildConfigFromMeta, serializable, 'processed')
        }
      } else if (state.base.user.image) {
        yield put(setActiveSource('user'))
        yield fork(rebuildConfigFromMeta, state.base.user.image, 'user')
      } else if (stockImage) {
        yield put(setActiveSource('stock'))
        yield fork(rebuildConfigFromMeta, stockImage, 'stock')
      }
    } else if (source === 'user') {
      yield call(storeAdapters.userImages.deleteById, 'current')
      yield put(removeUserImage())

      if (state.cropIds.length > 0) {
        const lastId = state.cropIds[state.cropIds.length - 1]
        const lastCrop: ImageMeta = yield call(
          storeAdapters.cropImages.getById,
          lastId,
        )
        if (lastCrop) {
          const serializable = prepareForRedux({
            ...lastCrop,
            url: lastCrop.full?.blob
              ? URL.createObjectURL(lastCrop.full.blob)
              : lastCrop.url,
          })
          yield put(setProcessedImage(serializable))
          yield put(setActiveSource('processed'))
          yield fork(rebuildConfigFromMeta, serializable, 'processed')
        }
      } else {
        if (stockImage) {
          yield put(setActiveSource('stock'))
          yield fork(rebuildConfigFromMeta, stockImage, 'stock')
        }
      }
    }

    yield fork(syncToolbarContext)
  } catch (error) {
    console.error('Delete flow failed:', error)
  }
}

export function* handleClearAllCropsSaga() {
  console.log('handleClearAll')
  try {
    yield put(markLoading())
    yield call(storeAdapters.cropImages.clear)
    yield put(clearAllCrops())
    yield fork(syncToolbarContext)

    // yield put(showNotification({ message: 'History cleared', type: 'success' }))
  } catch (error) {
    console.error('Failed to clear crops history:', error)
  } finally {
    yield put(markLoaded())
  }
}

export function* syncQualitySaga() {
  const state: CardphotoState = yield select((s) => s.cardphoto)
  const config = state.currentConfig

  console.log('syncQualitySaga')

  if (config?.crop && config?.image) {
    const { qualityProgress, quality } = calculateCropQuality(
      config.crop.meta,
      config.image,
      config.image.meta,
      config.card.orientation,
    )
    dispatchQualityUpdate(qualityProgress, quality)
  }
}

export function* handleCropGalleryAction() {
  const sizeCard: SizeCard = yield select(selectSizeCard)
  const newOrientation: LayoutOrientation =
    sizeCard.orientation === 'portrait' ? 'landscape' : 'portrait'

  const viewportSize: ViewportSizeState = yield select(selectViewportSize)
  const viewportHeight = viewportSize?.height ?? sizeCard.height

  yield put(setCardOrientation({ orientation: newOrientation, viewportHeight }))

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'orientation',
      value: newOrientation,
    }),
  )
}

export function* handleBackToOriginalSaga() {
  const state: CardphotoState = yield select(selectCardphotoState)
  const userMeta = state.base.user.image
  const stockMeta = state.base.stock.image
  const activeSource = state.activeSource

  let nextSource: ImageSource | null = null
  let nextMeta = null

  if (activeSource === 'processed') {
    if (userMeta) {
      nextSource = 'user'
      nextMeta = userMeta
    } else {
      nextSource = 'stock'
      nextMeta = stockMeta
    }
  } else if (activeSource === 'user') {
    nextSource = 'stock'
    nextMeta = stockMeta
  } else if (activeSource === 'stock' && userMeta) {
    nextSource = 'user'
    nextMeta = userMeta
  }

  if (nextSource && nextMeta) {
    const toolbarState: CardphotoToolbarState = yield select(
      selectToolbarSectionState('cardphoto'),
    )

    if (toolbarState.crop.state === 'active') {
      yield call(updateCropToolbarState, 'enabled', toolbarState)
    }

    const config: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      nextMeta,
      nextSource,
      nextMeta.orientation,
    )

    yield put(
      hydrateEditor({
        ...state,
        config,
        activeSource: nextSource,
      }),
    )

    yield fork(syncToolbarContext)
  }
}

export function* handleBackToOriginalSaga1() {
  const state: CardphotoState = yield select(selectCardphotoState)
  const userMeta = state.base.user.image
  const stockMeta = state.base.stock.image
  const activeSource = state.activeSource

  if (
    (activeSource === 'processed' || activeSource === 'stock') &&
    userMeta &&
    state.currentConfig
  ) {
    // const cardLayer = state.currentConfig.card

    const config: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      userMeta,
      activeSource,
      userMeta.orientation,
    )

    yield put(
      hydrateEditor({
        ...state,
        config,
        activeSource: 'user',
      }),
    )

    yield fork(syncToolbarContext)
  }

  if (activeSource === 'user' && state.currentConfig && stockMeta) {
    // const cardLayer = state.currentConfig.card
    const toolbarState: CardphotoToolbarState = yield select(
      selectToolbarSectionState('cardphoto'),
    )
    const isCropActivating = toolbarState.crop.state === 'active'

    if (isCropActivating) {
      yield call(updateCropToolbarState, 'enabled', toolbarState)
    }

    const config: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      stockMeta,
      activeSource,
    )

    yield put(
      hydrateEditor({
        ...state,
        config,
        activeSource: 'stock',
      }),
    )

    yield fork(syncToolbarContext)
  }
}
