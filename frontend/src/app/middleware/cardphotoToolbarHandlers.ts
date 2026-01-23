import { call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { nanoid } from 'nanoid'
import type { SagaIterator } from 'redux-saga'
import { RootState } from '../state'
import {
  addOperation,
  applyFinal,
  type CardphotoSliceState,
  markLoading,
  markLoaded,
} from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import {
  selectCurrentConfig,
  selectCardphotoState,
  selectActiveSourceImage,
  selectIsCropFull,
} from '@cardphoto/infrastructure/selectors'
import { applyBounds } from '@cardphoto/application/helpers'
import { updateCropToolbarState } from './cardphotoToolbarHelpers'
import {
  getCroppedBase64,
  transformCropForOrientation,
  calculateCropQuality,
  dispatchQualityUpdate,
} from '@cardphoto/application/helpers'
import { setCardOrientation, setSizeCard } from '@layout/infrastructure/state'
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
  ImageOrientation,
  CropLayer,
} from '@cardphoto/domain/types'

export function* handleCropAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto'),
  )
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config) return
  const isActivating = state.crop === 'enabled'
  const baseImage: ImageMeta = yield select(selectActiveSourceImage)

  if (isActivating) {
    const cropToUse =
      config.crop ||
      createInitialCropLayer(config.image, config.card, baseImage)
    const newConfig = { ...config, crop: cropToUse }

    yield put(
      addOperation({
        type: 'operation',
        payload: { config: newConfig, reason: 'activateCrop' },
      }),
    )

    // yield call(updateCropToolbarState, 'active', state)

    yield call(syncCropFullIcon, {
      forceActive: true,
      customConfig: newConfig,
    })
  } else {
    yield call(updateCropToolbarState, 'enabled', state)
  }
}

export function* handleCropCheckAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto'),
  )
  if (state.crop !== 'active') return

  const currentConfig: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!currentConfig) return

  const { crop, image, card } = currentConfig
  const imageMeta = image.meta

  const img = new Image()
  img.src = imageMeta.url
  yield new Promise((resolve) => {
    img.onload = resolve
  })

  const croppedBase64 = getCroppedBase64(img, crop, {
    width: img.naturalWidth,
    height: img.naturalHeight,
  })

  const newImage: ImageMeta = {
    id: imageMeta.id + '-crop',
    url: croppedBase64,
    width: crop.meta.width,
    height: crop.meta.height,
    source: imageMeta.source,
    imageAspectRatio: roundTo(crop.meta.width / crop.meta.height, 2),
    isCropped: true,
    timestamp: Date.now(),
  }

  const newConfig: WorkingConfig = {
    card,
    image: {
      ...image,
      meta: newImage,
    },
    crop,
  }

  const op: CardphotoOperation = {
    type: 'operation',
    payload: {
      config: newConfig,
      reason: 'crop',
    },
  }

  yield put(addOperation(op))
  // yield put(applyFinal(newImage))
  yield* updateCropToolbarState('enabled', state)
}

export function* handleCropFullAction(): SagaIterator {
  const state = (yield select(selectCardphotoState)) as CardphotoState
  if (!state?.currentConfig) return
  const baseImage: ImageMeta = yield select(selectActiveSourceImage)

  const { image, card } = state.currentConfig

  const rawFullCrop = createFullCropLayer(image, card)
  const fullCrop = applyBounds(rawFullCrop, image, card.orientation)

  const { quality, qualityProgress } = calculateCropQuality(
    fullCrop.meta,
    image,
    baseImage,
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

  const currentStatus = params?.forceActive ? 'active' : toolbarState.crop

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
  const sizeCard: SizeCard = yield select(selectSizeCard)
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config || !config.image?.meta) return
  const baseImage: ImageMeta = yield select(selectActiveSourceImage)

  const newImageLayer: ImageLayer = fitImageToCard(
    config.image.meta,
    sizeCard,
    config.image.orientation,
    config.image.meta.isCropped,
  )
  const newCropLayer = createInitialCropLayer(
    newImageLayer,
    sizeCard,
    baseImage,
  )
  const newConfig: WorkingConfig = {
    card: sizeCard,
    image: newImageLayer,
    crop: newCropLayer,
  }

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
  const isCropActive = toolbarState.crop === 'active'

  const baseImage: ImageMeta = yield select(selectActiveSourceImage)

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
  const height = config.card.height

  const rawWidth =
    newOrientation === 'landscape' ? height * ratio : height / ratio
  const width = roundTo(rawWidth, 2)

  const newCardLayer: CardLayer = {
    ...config.card,
    orientation: newOrientation,
    height,
    width,
    aspectRatio: ratio,
  }

  const newImageLayer = fitImageToCard(
    baseImage,
    newCardLayer,
    config.image.orientation,
    config.image.meta.isCropped,
  )

  const newCropLayer = createInitialCropLayer(
    newImageLayer,
    newCardLayer,
    baseImage,
  )

  const newConfig: WorkingConfig = {
    card: newCardLayer,
    image: newImageLayer,
    crop: newCropLayer,
  }

  const op: CardphotoOperation = {
    type: 'operation',
    payload: { config: newConfig, reason: 'rotateCard' },
  }

  yield put(setSizeCard(newCardLayer))
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

function rotateLeft(o: ImageOrientation): ImageOrientation {
  switch (o) {
    case 0:
      return 270
    case 270:
      return 180
    case 180:
      return 90
    case 90:
      return 0
    default:
      return 0
  }
}

function rotateRight(o: ImageOrientation): ImageOrientation {
  switch (o) {
    case 0:
      return 90
    case 90:
      return 180
    case 180:
      return 270
    case 270:
      return 0
    default:
      return 0
  }
}

export function* handleImageRotate(
  key: 'imageRotateLeft' | 'imageRotateRight',
): SagaIterator {
  const state = yield select(selectCardphotoState)
  const baseImage: ImageMeta = yield select(selectActiveSourceImage)

  if (!state?.currentConfig || !baseImage) return

  const currentConfig: WorkingConfig = state.currentConfig
  const currentOrientation = state.currentConfig.image.orientation ?? 0
  const nextOrientation =
    key === 'imageRotateRight'
      ? rotateRight(currentOrientation)
      : rotateLeft(currentOrientation)

  const newImageLayer = fitImageToCard(
    baseImage,
    currentConfig.card,
    nextOrientation,
    currentConfig.image.meta.isCropped,
  )

  const newCropLayer = createInitialCropLayer(
    newImageLayer,
    currentConfig.card,
    baseImage,
  )
  const newConfig: WorkingConfig = {
    ...currentConfig,
    image: newImageLayer,
    crop: {
      ...newCropLayer,
      meta: {
        ...newCropLayer.meta,
      },
    },
  }

  const op: CardphotoOperation = {
    type: 'operation',
    payload: {
      config: newConfig,
      reason: 'rotateImage',
    },
  }

  yield put(addOperation(op))
}

export function* handleCropConfirm(): SagaIterator {
  const state: CardphotoState = yield select(selectCardphotoState)
  const config = state.currentConfig

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
      x: roundTo(config.crop.x * scaleX, 2),
      y: roundTo(config.crop.y * scaleY, 2),
      meta: {
        ...config.crop.meta,
        width: roundTo(config.crop.meta.width * scaleX, 2),
        height: roundTo(config.crop.meta.height * scaleY, 2),
      },
    }

    const croppedBlob: Blob = yield call(getCroppedImg, img, realCrop)
    const croppedUrl = URL.createObjectURL(croppedBlob)

    const finalImageMeta: ImageMeta = {
      ...config.image.meta,
      id: nanoid(),
      url: croppedUrl,
      width: realCrop.meta.width,
      height: realCrop.meta.height,
      imageAspectRatio: config.crop.meta.aspectRatio,
      blob: croppedBlob,
      timestamp: Date.now(),
    }

    yield put(applyFinal(finalImageMeta))

    const newImageLayer = fitImageToCard(
      finalImageMeta,
      config.card,
      0,
      config.image.meta.isCropped,
    )
    const newCropLayer = createInitialCropLayer(
      newImageLayer,
      config.card,
      finalImageMeta,
    )

    const finalConfig: WorkingConfig = {
      card: config.card,
      image: newImageLayer,
      crop: newCropLayer,
    }

    // const finalConfig: WorkingConfig = {
    //   ...config,
    //   image: {
    //     ...config.image,
    //     meta: finalImageMeta,
    //     orientation: 0,
    //     left: 0,
    //     top: 0,
    //   },
    // }

    yield put(
      addOperation({
        type: 'operation',
        payload: { config: finalConfig, reason: 'applyCrop' },
      }),
    )

    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'crop',
        value: 'enabled',
      }),
    )
  } catch (error) {
    console.error('Error crop:', error)
  } finally {
    yield put(markLoaded())
  }
}

export function* syncQualitySaga() {
  const state: CardphotoState = yield select((s) => s.cardphoto)
  const config = state.currentConfig

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

// export function* handleHistoryStackAction(): SagaIterator {
//   const state: CardphotoState = yield select(selectCardphotoState)
//   const { activeIndex, operations } = state

//   if (operations.length <= 1) return

//   if (activeIndex === 0) {
//     yield put(cardphotoActions.goToOperation(1))
//   } else {
//     let nextIndex = activeIndex + 1
//     if (nextIndex >= operations.length) {
//       nextIndex = 1
//     }
//     yield put(cardphotoActions.goToOperation(nextIndex))
//   }
// }

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
