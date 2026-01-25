import {
  call,
  takeLatest,
  all,
  fork,
  select,
  put,
  takeEvery,
} from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  addOperation,
  // initStockImage,
  initUserImage,
  resetCardphoto,
  setActiveSource,
  hydrateEditor,
  setProcessedImage,
} from '@cardphoto/infrastructure/state'
import {
  handleCropAction,
  handleCropCheckAction,
  handleCardOrientation,
  handleImageRotate,
  handleCropFullAction,
  syncCropFullIcon,
  handleCropConfirm,
  handleCropGalleryAction,
} from './cardphotoToolbarHandlers'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import {
  getQualityColor,
  dispatchQualityUpdate,
  calculateCropQuality,
} from '@cardphoto/application/helpers'
import { onDownloadClick } from './cardphotoProcessSaga'
import {
  updateToolbarSection,
  updateToolbarIcon,
  updateGroupStatus,
} from '@toolbar/infrastructure/state'
import type { CardphotoState } from '@cardphoto/domain/types'

export function* watchCropChanges(): SagaIterator {
  yield takeLatest(addOperation.type, function* (): SagaIterator {
    yield call(syncCropFullIcon)

    const state = (yield select((s) => s.cardphoto)) as CardphotoState

    const config = state.currentConfig

    if (config?.crop && config?.image?.meta) {
      const { quality, qualityProgress } = calculateCropQuality(
        config.crop.meta,
        config.image,
        config.image.meta,
        config.card.orientation,
      )

      yield call(dispatchQualityUpdate, qualityProgress, quality)

      const color = getQualityColor(qualityProgress)
      document.documentElement.style.setProperty('--crop-handle-color', color)
    }
  })
}

export function* handleCardphotoToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'cardphoto') return

  switch (key) {
    case 'download':
      yield call(onDownloadClick)
      break
    case 'crop':
      yield* handleCropAction()
      break
    case 'cropCheck':
      yield call(handleCropConfirm)
      break
    case 'cropFull':
      yield call(handleCropFullAction)
      break
    case 'cropHistory':
      yield call(handleCropGalleryAction)
      break
    case 'cardOrientation':
      yield call(handleCardOrientation)
      break
    case 'imageRotateLeft':
    case 'imageRotateRight':
      yield call(handleImageRotate, key)
      break
  }
}

export function* watchCropToolbarStatus(): SagaIterator {
  yield takeLatest(updateToolbarIcon.type, function* (action: any) {
    const { key, value, section } = action.payload
    if (section !== 'cardphoto' || key !== 'crop') return

    const subButtonsStatus = value === 'active' ? 'enabled' : 'disabled'

    yield all([
      put(
        updateToolbarIcon({
          section,
          key: 'cropFull',
          value: subButtonsStatus,
        }),
      ),
      put(
        updateToolbarIcon({
          section,
          key: 'cropCheck',
          value: subButtonsStatus,
        }),
      ),
    ])
  })
}

// export function* syncCropHistoryIcon() {
//   const state: CardphotoToolbarState = yield select(
//     (state) => state.cardphoto.state,
//   )

//   if (!state) return

//   const cropsCount = state.cropIndices.length

//   console.log('getCropHistory', state)

//   const isOriginalShowing = state.activeIndex === 0

//   yield put(
//     updateToolbarIcon({
//       section: 'cardphoto',
//       key: 'cropHistory',
//       value: cropsCount > 0 ? 'enabled' : 'disabled',
//       // badge: cropsCount > 0 ? cropsCount : null,
//     }),
//   )

//   yield put(
//     updateToolbarIcon({
//       section: 'cardphoto',
//       key: 'undo',
//       value: !isOriginalShowing ? 'enabled' : 'disabled',
//     }),
//   )

//   yield put(
//     updateToolbarIcon({
//       section: 'cardphoto',
//       key: 'cropDelete',
//       value: cropsCount > 0 ? 'enabled' : 'disabled',
//     }),
//   )
// }

export function* syncToolbarContext() {
  const state: CardphotoState = yield select((s) => s.cardphoto.state)
  if (!state) return

  const { activeSource, cropCount } = state
  console.log('syncToolbarContext cropCount', cropCount)
  const hasCrops = cropCount > 0

  const isPhotoEnabled = activeSource !== null
  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: isPhotoEnabled ? 'enabled' : 'disabled',
    }),
  )

  let sectionUpdate = {}

  switch (activeSource) {
    case 'processed':
      sectionUpdate = {
        cardOrientation: 'disabled',
        imageRotateLeft: 'disabled',
        imageRotateRight: 'disabled',
        imageReset: 'enabled',
        crop: 'disabled',
        cropHistory: 'active',
        cropDelete: 'enabled',
        cropBadge: cropCount,
      }
      break

    case 'user':
      sectionUpdate = {
        cardOrientation: 'enabled',
        imageRotateLeft: 'enabled',
        imageRotateRight: 'enabled',
        imageReset: 'disabled',
        crop: 'enabled',
        cropHistory: hasCrops ? 'enabled' : 'disabled',
        cropDelete: 'disabled',
        cropBadge: cropCount,
      }
      break

    case 'stock':
    default:
      sectionUpdate = {
        cardOrientation: 'disabled',
        imageRotateLeft: 'disabled',
        imageRotateRight: 'disabled',
        imageReset: 'disabled',
        crop: 'disabled',
        cropHistory: hasCrops ? 'enabled' : 'disabled',
        cropDelete: 'disabled',
        cropBadge: cropCount,
      }
      break
  }

  yield put(
    updateToolbarSection({
      section: 'cardphoto',
      value: sectionUpdate,
    }),
  )
}

export function* syncToolbarContext1() {
  const state: CardphotoState = yield select((s) => s.cardphoto.state)
  if (!state || !state.currentConfig) return

  console.log(
    'syncToolbarContext image.source: ',
    state.currentConfig.image.meta.source,
  )

  const sourceImage = state.currentConfig.image.meta.source

  // const { cropIndices } = state

  if (sourceImage === 'stock') {
    console.log('syncToolbarContext stock--->>>disabled')
    yield put(
      updateGroupStatus({
        section: 'cardphoto',
        groupName: 'photo',
        status: 'disabled',
      }),
    )
    return
  }

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'enabled',
    }),
  )

  const toolbarState: CardphotoToolbarState = yield select(
    (s) => s.toolbar.cardphoto,
  )

  const cropsCount: number = yield call(storeAdapters.cropImages.count)
  const hasCrops = cropsCount > 0
  const isCropActive = toolbarState.crop === 'active'

  if (sourceImage === 'processed') {
    console.log('syncToolbarContext processed--->>>')

    yield put(
      updateToolbarSection({
        section: 'cardphoto',
        value: {
          cardOrientation: 'disabled',
          imageRotateLeft: 'disabled',
          imageRotateRight: 'disabled',
          imageReset: 'enabled',
          crop: 'disabled',
          cropHistory: 'active',
          cropDelete: 'enabled',
        },
      }),
    )
  }

  if (sourceImage === 'user') {
    console.log('syncToolbarContext user--->>>enabled')

    yield put(
      updateToolbarSection({
        section: 'cardphoto',
        value: {
          ...toolbarState,
          cardOrientation: 'enabled',
          imageRotateLeft: 'enabled',
          imageRotateRight: 'enabled',
          imageReset: hasCrops ? 'enabled' : 'disabled',
          crop: isCropActive ? 'active' : 'enabled',
          cropDelete: 'disabled',
          cropHistory: hasCrops ? 'enabled' : 'disabled',
        },
      }),
    )
  }
}

// export function* watchCropHistory() {
//   yield takeEvery(
//     [addOperation.type, initStockImage.type, resetCardphoto.type],
//     syncCropHistoryIcon,
//   )
// }

export function* watchToolbarContext() {
  yield takeEvery(
    [
      hydrateEditor.type,
      setActiveSource.type,
      addOperation.type,
      // initStockImage.type,
      // initUserImage.type,
      resetCardphoto.type,
      setProcessedImage.type,
      // 'cardphoto/setActiveIndex',
    ],
    syncToolbarContext,
  )
}
