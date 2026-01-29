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
  resetCardphoto,
  setActiveSource,
  hydrateEditor,
  setProcessedImage,
  markLoaded,
  markLoading,
} from '@cardphoto/infrastructure/state'
import {
  selectIsLoading,
  selectCardphotoState,
  selectActiveSource,
  selectIsProcessedMode,
} from '@cardphoto/infrastructure/selectors'
import {
  handleCropAction,
  // handleCropCheckAction,
  handleCardOrientation,
  handleImageRotate,
  handleCropFullAction,
  syncCropFullIcon,
  handleCropConfirm,
  handleCropGalleryAction,
  handleClearAllCropsSaga,
  handleDeleteImageSaga,
  handleBackToOriginalSaga,
} from './cardphotoToolbarHandlers'
import { selectSizeCard } from '@layout/infrastructure/selectors'
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
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import type { CardphotoState, ImageSource } from '@cardphoto/domain/types'
import { SizeCard } from '@layout/domain/types'

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
    case 'closeList':
      yield call(handleClearAllCropsSaga)
      break
    case 'close':
      const state: CardphotoState = yield select(selectCardphotoState)
      const isProcessed: boolean = yield select(selectIsProcessedMode)

      console.log(state.base.stock.image)

      const currentImageId = isProcessed
        ? state.base.processed.image?.id
        : state.base.user.image?.id

      yield call(handleDeleteImageSaga, currentImageId, state.activeSource)
      break
    case 'download':
      yield call(onDownloadClick)
      break
    case 'imageReset':
      yield call(handleBackToOriginalSaga)
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

// export function* watchCropToolbarStatus(): SagaIterator {
//   yield takeLatest(updateToolbarIcon.type, function* (action: any) {
//     const { key, value, section } = action.payload
//     if (section !== 'cardphoto' || key !== 'crop') return

//     const subButtonsStatus = value === 'active' ? 'enabled' : 'disabled'

//     yield all([
//       put(
//         updateToolbarIcon({
//           section,
//           key: 'cropFull',
//           value: subButtonsStatus,
//         }),
//       ),
//       put(
//         updateToolbarIcon({
//           section,
//           key: 'cropCheck',
//           value: subButtonsStatus,
//         }),
//       ),
//     ])
//   })
// }

export function* syncToolbarContext() {
  const state: CardphotoState = yield select((s) => s.cardphoto.state)
  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto'),
  )

  if (!state || toolbarState.crop === 'active') return

  const { activeSource, cropCount } = state
  console.log('syncToolbarContext + cropCount', cropCount)
  const hasCrops = cropCount > 0

  let sectionUpdate = {}
  const isUserImage = !!state.base.user.image

  switch (activeSource) {
    case 'processed':
      console.log('syncToolbarContext processed', activeSource)
      sectionUpdate = {
        cardOrientation: 'disabled',
        imageRotateLeft: 'disabled',
        imageRotateRight: 'disabled',
        crop: 'disabled',
        cropFull: 'disabled',
        imageReset: 'enabled',

        apply: 'enabled',
        close: 'enabled',
        download: 'enabled',
        cropHistory: 'enabled',
        cropBadge: cropCount,
        closeList: hasCrops ? 'enabled' : 'disabled',
      }
      break

    case 'user':
      console.log('syncToolbarContext user', activeSource)
      const sizeCard: SizeCard = yield select(selectSizeCard)
      sectionUpdate = {
        cardOrientation: sizeCard.orientation,
        imageRotateLeft: 'enabled',
        imageRotateRight: 'enabled',
        crop: 'enabled',
        imageReset: 'enabled',

        apply: 'disabled',
        close: 'enabled',
        download: 'enabled',
        cropHistory: hasCrops ? 'enabled' : 'disabled',
        cropBadge: cropCount,
        closeList: hasCrops ? 'enabled' : 'disabled',
      }
      break

    case 'stock':
    default:
      console.log('syncToolbarContext stock', activeSource)
      sectionUpdate = {
        cardOrientation: 'disabled',
        imageRotateLeft: 'disabled',
        imageRotateRight: 'disabled',
        crop: 'disabled',
        cropFull: 'disabled',
        imageReset: isUserImage ? 'enabled' : 'disabled',

        apply: 'enabled',
        close: 'disabled',
        download: 'enabled',
        cropHistory: hasCrops ? 'enabled' : 'disabled',
        cropBadge: cropCount,
        closeList: hasCrops ? 'enabled' : 'disabled',
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

export function* watchToolbarContext() {
  yield takeEvery(
    [
      hydrateEditor.type,
      setActiveSource.type,
      addOperation.type,
      resetCardphoto.type,
      setProcessedImage.type,
      markLoaded.type,
      markLoading.type,
    ],
    syncToolbarContext,
  )
}
