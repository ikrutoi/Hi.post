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
import { persistGlobalSession } from './sessionSaga'
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
  commitWorkingConfig,
  setBaseImage,
  uploadImageReady,
  hydrateEditor,
  clearCurrentConfig,
  selectCropFromHistory,
  removeCropId,
} from '@cardphoto/infrastructure/state'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { prepareForRedux, prepareConfigForRedux } from './cardphotoHelpers'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { validateImageSize } from '@cardphoto/application/helpers'
import { setSizeCard } from '@layout/infrastructure/state'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { roundTo } from '@shared/utils/layout'
import {
  updateToolbarSection,
  updateToolbarIcon,
} from '@toolbar/infrastructure/state'
import {} from './cardphotoHelpers'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import {
  fitImageToCard,
  createInitialCropLayer,
} from '@cardphoto/application/utils/imageFit'
import { updateCropToolbarState } from './cardphotoHelpers'
import {
  handleCardphotoToolbarAction,
  watchCropChanges,
  // watchCropToolbarStatus,
  // watchCropHistory,
  watchToolbarContext,
  onSelectCropFromHistorySaga,
} from './cardphotoToolbarSaga'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type {
  ImageMeta,
  CardLayer,
  WorkingConfig,
  CardphotoState,
  CardphotoBase,
  ActiveImageSource,
  ImageRotation,
  CardphotoSessionRecord,
  ImageRecord,
} from '@cardphoto/domain/types'
import type { SizeCard, LayoutOrientation } from '@layout/domain/types'
import { setAsset } from '@/entities/assetRegistry/infrastructure/state'
import { CURRENT_EDITOR_IMAGE_ID } from '@cardphoto/domain/editorImageId'

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
  console.log('onDownload')

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
    // console.log('onUploadImage')

    yield put(
      setAsset({
        id: imageMeta.id,
        url: imageMeta.url,
        thumbUrl: imageMeta.thumbnail?.url || imageMeta.url,
      }),
    )

    const state: CardphotoState = yield select(selectCardphotoState)
    const isComplete = !!state.base.apply.image
    const config: WorkingConfig = yield call(
      rebuildConfigFromMeta,
      imageMeta,
      'user',
    )

    const imageRecord: ImageRecord = {
      id: CURRENT_EDITOR_IMAGE_ID,
      image: imageMeta,
    }
    yield call([storeAdapters.editorImages, 'put'], imageRecord)

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
        isComplete,
      }),
    )
  } catch (error) {
    console.error('Error in onUploadImageReadySaga:', error)
  } finally {
    yield put(markLoaded())
  }

  console.log('onUpload')

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

function* onCancelFileDialog(): SagaIterator {
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
  source: ActiveImageSource,
  forceOrientation?: LayoutOrientation,
  rotation?: ImageRotation,
) {
  try {
    // console.log('REBUILD+ meta', meta)
    yield put(clearCurrentConfig())
    yield delay(16)

    const currentCard: SizeCard = yield select(selectSizeCard)

    // Cardphoto cards are square (125x125mm), so we never switch layout orientation here.
    // Keep `forceOrientation` for backward compatibility with older call sites.
    void forceOrientation

    const newRotation = rotation ?? meta.rotation ?? 0

    const updatedCard: CardLayer = yield select(selectSizeCard)
    const imageLayer = fitImageToCard(meta, updatedCard, newRotation, false)
    const cropLayer = createInitialCropLayer(imageLayer, updatedCard, meta)

    const newConfig: WorkingConfig = {
      card: updatedCard,
      image: imageLayer,
      crop: cropLayer,
    }

    if (source === 'user') {
      const newOriginalMeta = {
        ...meta,
        // orientation doesn't affect square calculations anymore
        orientation: meta.orientation ?? 'landscape',
        rotation: newRotation,
      }

      const serializableMeta = prepareForRedux(newOriginalMeta)

      yield put(setBaseImage({ target: 'user', image: serializableMeta }))
    }

    yield put(commitWorkingConfig(prepareConfigForRedux(newConfig)))

    yield fork(persistGlobalSession)

    return newConfig
  } catch (error) {
    return null
  }
}

export function* onDeleteCropSaga(action: PayloadAction<string>): SagaIterator {
  try {
    const cropId = action.payload

    yield call(
      [storeAdapters.cardphotoImages, storeAdapters.cardphotoImages.deleteById],
      cropId,
    )
  } catch (error) {
    console.error('Failed to delete crop from DB:', error)
  }
}

export function* cardphotoProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleCardphotoToolbarAction),

    takeEvery(selectCropFromHistory.type, onSelectCropFromHistorySaga),
    takeEvery(removeCropId.type, onDeleteCropSaga),

    fork(watchCropChanges),
    fork(watchToolbarContext),

    takeLatest(uploadUserImage.type, onUploadImageReadySaga),
    takeEvery(cancelFileDialog.type, onCancelFileDialog),
  ])
}
