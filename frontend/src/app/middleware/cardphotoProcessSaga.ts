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
  cancelFileDialog,
  markLoading,
  markLoaded,
  setNeedsCrop,
  resetCropLayers,
} from '@cardphoto/infrastructure/state'
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
} from './cardphotoToolbarSaga'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ImageMeta, CardLayer } from '@cardphoto/domain/types'

export function* onDownloadClick(): SagaIterator {
  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'disabled',
    })
  )

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'download',
      value: 'disabled',
    })
  )

  yield put(openFileDialog())
  yield put(markLoading())
}

function* onUploadImage(action: PayloadAction<ImageMeta>) {
  const imageMeta = action.payload
  if (!imageMeta) return

  yield put(markLoaded())

  const cardLayer: CardLayer = yield select(selectSizeCard)
  if (!cardLayer) return

  const { needsCrop } = validateImageSize(
    imageMeta,
    cardLayer.width,
    cardLayer.height
  )
  yield put(setNeedsCrop(needsCrop))

  const imageLayer = fitImageToCard(imageMeta, cardLayer, 0)
  const cropLayer = createInitialCropLayer(imageLayer, cardLayer)

  yield put(
    resetCropLayers({
      imageLayer,
      cropLayer,
      card: {
        width: cardLayer.width,
        height: cardLayer.height,
        aspectRatio: cardLayer.width / cardLayer.height,
        orientation: cardLayer.orientation,
      },
    })
  )

  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )
  const newState = {
    ...state,
    download: 'enabled',
    save: 'enabled',
    apply: needsCrop ? 'enabled' : 'disabled',
  }

  yield put(updateToolbarSection({ section: 'cardphoto', value: newState }))
}

function* onCancelFileDialog(): SagaIterator {
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'download',
      value: 'enabled',
    })
  )

  yield put(markLoaded())

  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'enabled',
    })
  )
}

export function* cardphotoProcessSaga(): SagaIterator {
  yield all([
    takeLatest(toolbarAction.type, handleCardphotoToolbarAction),

    fork(watchCropChanges),

    takeEvery(uploadUserImage.type, onUploadImage),
    takeEvery(cancelFileDialog.type, onCancelFileDialog),
  ])
}
