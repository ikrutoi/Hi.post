import {
  takeEvery,
  put,
  select,
  all,
  takeLatest,
  fork,
} from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
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
  watchCropToolbarStatus,
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
  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto'),
  )

  console.log('onDownloadClick+')

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'download',
      value: 'disabled',
    }),
  )

  if (toolbarState.crop === 'active') {
    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'crop',
        value: 'enabled',
      }),
    )
  }

  yield put(openFileDialog())
  yield put(markLoading())
}

function* onUploadImage(action: PayloadAction<ImageMeta>) {
  const imageMeta = action.payload
  console.log('onUploadImage imageMeta', imageMeta)
  if (!imageMeta) return

  yield put(setBaseImage({ target: 'user', image: imageMeta }))
}

function* onUploadImageReadySaga(action: PayloadAction<ImageMeta>) {
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
      user: { image: imageMeta },
      processed: { image: null },
    }

    yield put(
      hydrateEditor({
        base,
        config: newConfig,
        activeSource: 'user',
        cropCount,
        cropIds,
      }),
    )

    // const { needsCrop } = validateImageSize(
    //   imageMeta,
    //   cardLayer.width,
    //   cardLayer.height,
    // )

    // yield put(
    //   updateToolbarIcon({
    //     section: 'cardphoto',
    //     key: 'apply',
    //     value: needsCrop ? 'enabled' : 'disabled',
    //   }),
    // )
  } catch (error) {
    console.error('Error in onUploadImageReadySaga:', error)
  } finally {
    yield put(markLoaded())
  }
}

function* onCancelFileDialog(): SagaIterator {
  console.log('onCancelFileDialog')
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'download',
      value: 'enabled',
    }),
  )

  yield put(markLoaded())

  // const state: CardphotoToolbarState = yield select(
  //   selectToolbarSectionState('cardphoto'),
  // )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'enabled',
    }),
  )
}

export function* cardphotoProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleCardphotoToolbarAction),

    fork(watchCropChanges),
    fork(watchCropToolbarStatus),
    fork(watchToolbarContext),

    // takeEvery(uploadUserImage.type, onUploadImage),
    takeLatest(uploadUserImage.type, onUploadImageReadySaga),
    takeEvery(cancelFileDialog.type, onCancelFileDialog),
  ])
}
