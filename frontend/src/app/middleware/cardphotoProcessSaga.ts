import {
  takeEvery,
  put,
  select,
  all,
  takeLatest,
  fork,
  call,
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
} from '@cardphoto/infrastructure/state'
import {
  prepareForRedux,
  prepareConfigForRedux,
} from './cardphotoToolbarHelpers'
import { selectCardphotoState } from '@cardphoto/infrastructure/selectors'
import { validateImageSize } from '@cardphoto/application/helpers'
import { selectSizeCard } from '@layout/infrastructure/selectors'
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
} from '@cardphoto/domain/types'

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
    const cardLayer: CardLayer = yield select(selectSizeCard)

    const state: CardphotoState = yield select(selectCardphotoState)
    const imageLayer = fitImageToCard(imageMeta, cardLayer, 0, false)
    const cropLayer = createInitialCropLayer(imageLayer, cardLayer, imageMeta)

    const newConfig: WorkingConfig = {
      card: cardLayer,
      image: imageLayer,
      crop: cropLayer,
    }

    const imageForDb = {
      ...imageMeta,
      id: 'current',
    }
    yield call(storeAdapters.userImages.put, imageForDb)

    const serializableMeta = prepareForRedux(imageMeta)
    const serializableConfig = prepareConfigForRedux(newConfig)

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

function* onUploadImage(action: PayloadAction<ImageMeta>) {
  const imageMeta = action.payload
  console.log('onUploadImage imageMeta', imageMeta)
  if (!imageMeta) return

  yield put(setBaseImage({ target: 'user', image: imageMeta }))
}

function* onUploadImageReadySaga1(action: PayloadAction<ImageMeta>) {
  try {
    const imageMeta = action.payload
    const cardLayer: CardLayer = yield select(selectSizeCard)

    const state: CardphotoState = yield select(selectCardphotoState)
    const cropCount = state.cropCount || 0
    const cropIds = state.cropIds || []

    const imageLayer = fitImageToCard(imageMeta, cardLayer, 0, false)
    const cropLayer = createInitialCropLayer(imageLayer, cardLayer, imageMeta)
    const newConfig: WorkingConfig = {
      card: cardLayer,
      image: imageLayer,
      crop: cropLayer,
    }

    const base: CardphotoBase = {
      ...state.base,
      user: { image: prepareForRedux(imageMeta) },
    }

    const imageForDb = {
      ...imageMeta,
      id: 'current',
    }

    const dataToSave = {
      id: 'current',
      config: newConfig,
      timestamp: Date.now(),
    }

    yield call(storeAdapters.userImages.put, imageForDb)

    yield put(
      hydrateEditor({
        base,
        config: newConfig,
        activeSource: 'user',
        cropCount,
        cropIds,
      }),
    )
  } catch (error) {
    console.error('Error in onUploadImageReadySaga:', error)
  } finally {
    yield put(markLoaded())
  }

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
