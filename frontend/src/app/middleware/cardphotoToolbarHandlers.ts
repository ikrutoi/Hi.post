import { put, select } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import {
  addOperation,
  applyFinal,
  type CardphotoSliceState,
} from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import {
  selectCurrentConfig,
  selectCardphotoSlice,
  selectCurrentImageMeta,
} from '@cardphoto/infrastructure/selectors'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { updateCropToolbarState } from './cardphotoToolbarHelpers'
import {
  getCroppedBase64,
  transformCropForOrientation,
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
} from '@cardphoto/application/utils'
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
} from '@cardphoto/domain/types'

export function* handleCropAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )
  // const currentSlice: CardphotoSliceState = yield select(selectCardphotoSlice)
  // if (!currentSlice.state || !currentSlice.state.currentConfig) return
  // const cardOrientation: LayoutOrientation =
  //   currentSlice.state.currentConfig.card.orientation

  const newCrop = state.crop === 'enabled' ? 'active' : 'enabled'
  yield* updateCropToolbarState(newCrop, state)
}

export function* handleCropCheckAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
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
    imageAspectRatio: crop.meta.width / crop.meta.height,
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

  const operation: CardphotoOperation = {
    type: 'operation',
    payload: {
      config: newConfig,
      reason: 'crop',
    },
  }

  yield put(addOperation(operation))
  yield put(applyFinal(newImage))
  yield* updateCropToolbarState('enabled', state)
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
    })
  )
}

export function* handleImageLayerUpdate() {
  const sizeCard: SizeCard = yield select(selectSizeCard)
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config || !config.image?.meta) return

  const newImageLayer: ImageLayer = fitImageToCard(config.image.meta, sizeCard)
  const newCropLayer = createInitialCropLayer(newImageLayer, sizeCard)
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

  const newOrientation: LayoutOrientation =
    config.card.orientation === 'portrait' ? 'landscape' : 'portrait'

  const ratio = config.card.aspectRatio
  const height = config.card.height

  const rawWidth =
    newOrientation === 'landscape' ? height * ratio : height / ratio
  const width = Number(rawWidth.toFixed(2))

  const newCardLayer: CardLayer = {
    ...config.card,
    orientation: newOrientation,
    height,
    width,
    aspectRatio: ratio,
  }
  const newImageLayer = fitImageToCard(config.image.meta, newCardLayer)

  // let newCropLayer = transformCropForOrientation(
  //   config.crop,
  //   config.card,
  //   newCardLayer,
  //   newImageLayer
  // )

  // const outOfBounds =
  //   newCropLayer.x < newImageLayer.left ||
  //   newCropLayer.y < newImageLayer.top ||
  //   newCropLayer.x + newCropLayer.meta.width >
  //     newImageLayer.left + newImageLayer.meta.width ||
  //   newCropLayer.y + newCropLayer.meta.height >
  //     newImageLayer.top + newImageLayer.meta.height

  // const tooSmall = newCropLayer.meta.width < 10 || newCropLayer.meta.height < 10

  // if (outOfBounds || tooSmall) {
  const newCropLayer = createInitialCropLayer(newImageLayer, newCardLayer)
  // }

  const newConfig: WorkingConfig = {
    card: newCardLayer,
    image: newImageLayer,
    crop: newCropLayer,
  }

  const op: CardphotoOperation = {
    type: 'operation',
    payload: { config: newConfig, reason: 'rotateCard' },
  }

  yield put(addOperation(op))

  yield put(setSizeCard(newCardLayer))

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'orientation',
      value: newOrientation,
    })
  )
}
