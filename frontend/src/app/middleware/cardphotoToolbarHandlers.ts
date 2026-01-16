import { call, delay, put, select, takeLatest } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { RootState } from '../state'
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
  selectCardphotoState,
  selectActiveSourceImage,
  selectIsCropFull,
} from '@cardphoto/infrastructure/selectors'
import { applyBounds } from '@cardphoto/application/helpers'
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
  createFullCropLayer,
} from '@cardphoto/application/utils'
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
} from '@cardphoto/domain/types'

export function* handleCropAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config) return

  const isActivating = state.crop === 'enabled'

  if (isActivating) {
    let cropToUse = config.crop

    if (!cropToUse) {
      cropToUse = createInitialCropLayer(config.image, config.card)
    }

    const newConfig = { ...config, crop: cropToUse }

    yield put(
      addOperation({
        type: 'operation',
        payload: { config: newConfig, reason: 'activateCrop' },
      })
    )

    const isFull: boolean = yield select((state: RootState) =>
      selectIsCropFull({
        ...state,
        cardphoto: {
          ...state.cardphoto,
          state: { ...state.cardphoto.state, currentConfig: newConfig },
        },
      })
    )

    yield call(updateCropToolbarState, 'active', state, { isFull })
  } else {
    yield call(updateCropToolbarState, 'enabled', state)
  }
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

export function* handleCropFullAction1(): SagaIterator {
  const state = yield select(selectCardphotoState)

  if (!state?.currentConfig && state.crop !== 'active') return

  const { image, card } = state.currentConfig

  const fullCrop = createFullCropLayer(image, card)

  const newConfig: WorkingConfig = {
    ...state.currentConfig,
    crop: fullCrop,
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

export function* handleCropFullAction(): SagaIterator {
  const state = yield select(selectCardphotoState)
  if (!state?.currentConfig) return

  const { image, card } = state.currentConfig

  console.log('cropFull', image, card)

  const rawFullCrop = createFullCropLayer(image, card)

  const fullCrop = applyBounds(rawFullCrop, image, card.orientation)

  const newConfig: WorkingConfig = {
    ...state.currentConfig,
    crop: fullCrop,
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

export function* syncCropFullIcon(): SagaIterator {
  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  if (toolbarState.crop !== 'active') return

  const isFull: boolean = yield select(selectIsCropFull)

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
    })
  )
}

export function* handleImageLayerUpdate() {
  const sizeCard: SizeCard = yield select(selectSizeCard)
  const config: WorkingConfig | null = yield select(selectCurrentConfig)
  if (!config || !config.image?.meta) return

  const newImageLayer: ImageLayer = fitImageToCard(
    config.image.meta,
    sizeCard,
    config.image.orientation
  )
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

// export function* handleCardOrientation1(): SagaIterator {
//   const toolbarState: CardphotoToolbarState = yield select(
//     selectToolbarSectionState('cardphoto')
//   )
//   const config: WorkingConfig | null = yield select(selectCurrentConfig)

//   if (!config) return

//   const isCropActive = toolbarState.crop === 'active'

//   if (isCropActive) {
//     yield put(
//       updateToolbarIcon({
//         section: 'cardphoto',
//         key: 'crop',
//         value: 'disabled',
//       })
//     )
//   }

//   const newOrientation: LayoutOrientation =
//     config.card.orientation === 'portrait' ? 'landscape' : 'portrait'

//   const ratio = config.card.aspectRatio
//   const height = config.card.height

//   const rawWidth =
//     newOrientation === 'landscape' ? height * ratio : height / ratio
//   const width = roundTo(rawWidth, 2)

//   const newCardLayer: CardLayer = {
//     ...config.card,
//     orientation: newOrientation,
//     height,
//     width,
//     aspectRatio: ratio,
//   }
//   const newImageLayer = fitImageToCard(
//     config.image.meta,
//     newCardLayer,
//     config.image.orientation
//   )

//   const newCropLayer = createInitialCropLayer(newImageLayer, newCardLayer)

//   const newConfig: WorkingConfig = {
//     card: newCardLayer,
//     image: newImageLayer,
//     crop: newCropLayer,
//   }

//   const op: CardphotoOperation = {
//     type: 'operation',
//     payload: { config: newConfig, reason: 'rotateCard' },
//   }

//   yield put(setSizeCard(newCardLayer))

//   yield put(addOperation(op))

//   yield delay(0)

//   yield put(
//     updateToolbarIcon({
//       section: 'cardphoto',
//       key: 'orientation',
//       value: newOrientation,
//     })
//   )

//   const resultCropState = isCropActive ? 'active' : 'enabled'

//   yield put(
//     updateToolbarIcon({
//       section: 'cardphoto',
//       key: 'crop',
//       value: resultCropState,
//     })
//   )
// }

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
      })
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
    config.image.orientation
  )

  const newCropLayer = createInitialCropLayer(newImageLayer, newCardLayer)

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

  yield delay(0)

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'orientation',
      value: newOrientation,
    })
  )

  const resultCropState = isCropActive ? 'active' : 'enabled'
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'crop',
      value: resultCropState,
    })
  )
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
  key: 'imageRotateLeft' | 'imageRotateRight'
): SagaIterator {
  const state = yield select(selectCardphotoState)
  const sourceImageMeta: ImageMeta | null = yield select(
    selectActiveSourceImage
  )

  if (!state?.currentConfig || !sourceImageMeta) return

  const currentConfig: WorkingConfig = state.currentConfig
  const currentOrientation = state.currentConfig.image.orientation ?? 0
  const nextOrientation =
    key === 'imageRotateRight'
      ? rotateRight(currentOrientation)
      : rotateLeft(currentOrientation)

  const newImageLayer = fitImageToCard(
    sourceImageMeta,
    currentConfig.card,
    nextOrientation
  )

  const newCropLayer = createInitialCropLayer(newImageLayer, currentConfig.card)

  const newConfig: WorkingConfig = {
    ...currentConfig,
    image: newImageLayer,
    crop: newCropLayer,
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
