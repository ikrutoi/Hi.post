import {
  takeEvery,
  put,
  select,
  all,
  takeLatest,
  fork,
  call,
  delay,
} from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  openFileDialog,
  uploadUserImage,
  // initUserImage,
  cancelFileDialog,
  markLoading,
  markLoaded,
  setNeedsCrop,
  resetCropLayers,
  addOperation,
  setBaseImage,
  uploadImageReady,
  hydrateEditor,
  clearCurrentConfig,
} from '@cardphoto/infrastructure/state'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import {
  prepareForRedux,
  prepareConfigForRedux,
} from './cardphotoToolbarHelpers'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { validateImageSize } from '@cardphoto/application/helpers'
import { setSizeCard } from '@layout/infrastructure/state'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { roundTo } from '@shared/utils/layout'
import {
  updateToolbarSection,
  updateToolbarIcon,
} from '@toolbar/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import {
  fitImageToCard,
  createInitialCropLayer,
} from '@cardphoto/application/utils/imageFit'
import { updateCropToolbarState } from './cardphotoToolbarHelpers'
import {
  handleCardphotoToolbarAction,
  watchCropChanges,
  // watchCropToolbarStatus,
  // watchCropHistory,
  watchToolbarContext,
} from './cardphotoToolbarSaga'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  CardLayer,
  WorkingConfig,
  CardphotoOperation,
  CardphotoState,
  CardphotoBase,
  ImageSource,
  ImageRotation,
} from '@cardphoto/domain/types'
import type { SizeCard, LayoutOrientation } from '@layout/domain/types'

export function* onDownloadClick(): SagaIterator {
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'crop', value: 'enabled' }),
  )
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropCheck',
      value: 'disabled',
    }),
  )

  yield put(markLoading())

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'ui',
      status: 'disabled',
    }),
  )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'disabled',
    }),
  )

  yield put(openFileDialog())
}

function* onUploadImageReadySaga(action: PayloadAction<ImageMeta>) {
  try {
    const imageMeta = action.payload
    // const cardLayer: CardLayer = yield select(selectSizeCard)

    const state: CardphotoState = yield select(selectCardphotoState)
    console.log('onUploadImageReady--->>>', imageMeta)
    const config: WorkingConfig = yield call(rebuildConfigFromMeta, imageMeta)
    // const imageLayer = fitImageToCard(imageMeta, cardLayer, 0, false)
    // const cropLayer = createInitialCropLayer(imageLayer, cardLayer, imageMeta)

    // const newConfig: WorkingConfig = {
    //   card: cardLayer,
    //   image: imageLayer,
    //   crop: cropLayer,
    // }

    const imageForDb = {
      ...imageMeta,
      id: 'current',
    }
    yield call(storeAdapters.userImages.put, imageForDb)

    const serializableMeta = prepareForRedux(imageMeta)
    const serializableConfig = prepareConfigForRedux(config)

    const base: CardphotoBase = {
      ...state.base,
      user: { image: serializableMeta },
    }

    yield put(
      hydrateEditor({
        base,
        config: serializableConfig,
        activeSource: 'user',
        cropCount: state.cropCount || 0,
        cropIds: state.cropIds || [],
      }),
    )
  } catch (error) {
    console.error('Error in onUploadImageReadySaga:', error)
  } finally {
    yield put(markLoaded())
  }

  const groups = ['photo', 'ui']
  for (const groupName of groups) {
    yield put(
      updateGroupStatus({
        section: 'cardphoto',
        groupName,
        status: 'enabled',
      }),
    )
  }
}

// function* onUploadImage(action: PayloadAction<ImageMeta>) {
//   const imageMeta = action.payload
//   console.log('onUploadImage imageMeta', imageMeta)
//   if (!imageMeta) return

//   yield put(setBaseImage({ target: 'user', image: imageMeta }))
// }

// function* onUploadImageReadySaga1(action: PayloadAction<ImageMeta>) {
//   try {
//     const imageMeta = action.payload
//     // const cardLayer: CardLayer = yield select(selectSizeCard)

//     const state: CardphotoState = yield select(selectCardphotoState)
//     const cropCount = state.cropCount || 0
//     const cropIds = state.cropIds || []

//     const config: WorkingConfig = yield call(rebuildConfigFromMeta, imageMeta)
//     // const imageLayer = fitImageToCard(imageMeta, cardLayer, 0, false)
//     // const cropLayer = createInitialCropLayer(imageLayer, cardLayer, imageMeta)
//     // const newConfig: WorkingConfig = {
//     //   card: cardLayer,
//     //   image: imageLayer,
//     //   crop: cropLayer,
//     // }

//     const base: CardphotoBase = {
//       ...state.base,
//       user: { image: prepareForRedux(imageMeta) },
//     }

//     const imageForDb = {
//       ...imageMeta,
//       id: 'current',
//     }

//     // const dataToSave = {
//     //   id: 'current',
//     //   config,
//     //   timestamp: Date.now(),
//     // }

//     yield call(storeAdapters.userImages.put, imageForDb)

//     yield put(
//       hydrateEditor({
//         base,
//         config,
//         activeSource: 'user',
//         cropCount,
//         cropIds,
//       }),
//     )
//   } catch (error) {
//     console.error('Error in onUploadImageReadySaga:', error)
//   } finally {
//     yield put(markLoaded())
//   }

//   yield put(
//     updateGroupStatus({
//       section: 'cardphoto',
//       groupName: 'photo',
//       status: 'enabled',
//     }),
//   )

//   yield put(
//     updateGroupStatus({
//       section: 'cardphoto',
//       groupName: 'ui',
//       status: 'enabled',
//     }),
//   )
// }

function* onCancelFileDialog(): SagaIterator {
  console.log('onCancelFileDialog')

  yield put(markLoaded())

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'enabled',
    }),
  )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'ui',
      status: 'enabled',
    }),
  )
}

export function* rebuildConfigFromMeta(
  meta: ImageMeta,
  forceOrientation?: LayoutOrientation,
  rotation?: ImageRotation,
) {
  try {
    console.log('rebuild+ meta', meta)
    console.log('rebuild+ forceOrientation', forceOrientation)
    yield put(clearCurrentConfig())
    yield delay(16)

    const currentCard: SizeCard = yield select(selectSizeCard)

    let targetOrientation: LayoutOrientation
    if (forceOrientation) {
      targetOrientation = forceOrientation
    } else {
      targetOrientation = meta.orientation
        ? meta.orientation
        : meta.imageAspectRatio >= 1
          ? 'landscape'
          : 'portrait'
    }

    if (currentCard.orientation !== targetOrientation) {
      const cardBaseRatio =
        currentCard.aspectRatio > 1
          ? currentCard.aspectRatio
          : roundTo(1 / currentCard.aspectRatio, 3)

      const finalRatio =
        targetOrientation === 'landscape'
          ? cardBaseRatio
          : // : currentCard.aspectRatio
            roundTo(1 / cardBaseRatio, 3)

      console.log('rebuild++ finalRatio', finalRatio)

      const newWidth = Math.round(currentCard.height * finalRatio)

      yield put(
        setSizeCard({
          orientation: targetOrientation,
          width: newWidth,
          height: currentCard.height,
          // aspectRatio: currentCard.aspectRatio,
          aspectRatio: finalRatio,
        }),
      )
      yield delay(32)
    }

    const newRotation = rotation ?? 0

    const updatedCard: CardLayer = yield select(selectSizeCard)
    const imageLayer = fitImageToCard(meta, updatedCard, newRotation, false)
    const cropLayer = createInitialCropLayer(imageLayer, updatedCard, meta)

    const newConfig: WorkingConfig = {
      card: updatedCard,
      image: imageLayer,
      crop: cropLayer,
    }

    console.log('rebuild++++ newConfig', newConfig)
    console.log('rebuild5+ meta', meta)

    const newOriginalMeta = { ...meta, orientation: targetOrientation }

    yield put(setBaseImage({ target: 'user', image: newOriginalMeta }))

    yield put(
      addOperation({
        type: 'operation',
        payload: {
          config: newConfig,
          reason: forceOrientation ? 'rotateCard' : 'rebuild',
        },
      }),
    )

    return newConfig
  } catch (error) {
    console.error('Rebuild failed:', error)
    return null
  }
}

// export function* syncOrientationSaga(meta: ImageMeta) {
//   const sizeCard: SizeCard = yield select(selectSizeCard)

//   const imageOrientation: LayoutOrientation = meta.orientation
//     ? meta.orientation
//     : meta.imageAspectRatio >= 1
//       ? 'landscape'
//       : 'portrait'

//   if (sizeCard.orientation !== imageOrientation) {
//     const newWidth = Math.round(sizeCard.height * meta.imageAspectRatio)

//     yield put(
//       setSizeCard({
//         orientation: imageOrientation,
//         width: newWidth,
//         aspectRatio: meta.imageAspectRatio,
//       }),
//     )

//     yield delay(0)
//   }
// }

export function* cardphotoProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleCardphotoToolbarAction),

    fork(watchCropChanges),
    // fork(watchCropToolbarStatus),
    fork(watchToolbarContext),

    // takeEvery(uploadUserImage.type, onUploadImage),
    takeLatest(uploadUserImage.type, onUploadImageReadySaga),
    takeEvery(cancelFileDialog.type, onCancelFileDialog),
  ])
}
