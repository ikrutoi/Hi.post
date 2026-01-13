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
  addOperation,
  setBaseImage,
  uploadImageReady,
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
import type {
  ImageMeta,
  CardLayer,
  WorkingConfig,
  CardphotoOperation,
} from '@cardphoto/domain/types'

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

  if (toolbarState.crop === 'active') {
    yield put(
      updateToolbarIcon({
        section: 'cardphoto',
        key: 'crop',
        value: 'enabled',
      })
    )
  }

  yield put(openFileDialog())
  yield put(markLoading())
}

function* onUploadImage(action: PayloadAction<ImageMeta>) {
  const imageMeta = action.payload
  console.log('onUploadImage', imageMeta)
  if (!imageMeta) return

  yield put(setBaseImage({ target: 'user', image: imageMeta }))
}

function* onUploadImage1(action: PayloadAction<ImageMeta>) {
  const imageMeta = action.payload
  if (!imageMeta) return

  yield put(markLoaded())

  yield put(
    setBaseImage({
      target: 'user',
      image: imageMeta,
    })
  )

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

  const initialConfig: WorkingConfig = {
    card: cardLayer,
    image: imageLayer,
    crop: cropLayer,
  }

  yield put(
    addOperation({
      type: 'operation',
      payload: {
        config: initialConfig,
        reason: 'initUserImage',
      },
    })
  )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'enabled',
    })
  )

  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  yield put(
    updateToolbarSection({
      section: 'cardphoto',
      value: {
        ...toolbarState,
        download: 'enabled',
        save: 'enabled',
        apply: needsCrop ? 'enabled' : 'disabled',
      },
    })
  )
}

function* onUploadImageReadySaga(action: PayloadAction<ImageMeta>) {
  const imageMeta = action.payload
  const cardLayer: CardLayer = yield select(selectSizeCard)
  console.log('onUploadImageReady', imageMeta, cardLayer)

  if (!cardLayer) return

  const imageLayer = fitImageToCard(imageMeta, cardLayer, 0)
  const cropLayer = createInitialCropLayer(imageLayer, cardLayer)
  const { needsCrop } = validateImageSize(
    imageMeta,
    cardLayer.width,
    cardLayer.height
  )

  const newConfig: WorkingConfig = {
    card: cardLayer,
    image: imageLayer,
    crop: cropLayer,
  }

  // yield put(setBaseImage({ target: 'user', image: imageMeta }))

  yield put(resetCropLayers({ imageLayer, cropLayer, card: cardLayer }))

  yield put(
    addOperation({
      type: 'operation',
      payload: {
        config: newConfig,
        // config: { card: cardLayer, image: imageLayer, crop: cropLayer },
        reason: 'initUserImage',
      },
    })
  )

  yield put(
    updateGroupStatus({
      section: 'cardphoto',
      groupName: 'photo',
      status: 'enabled',
    })
  )

  const toolbarState: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  yield put(
    updateToolbarSection({
      section: 'cardphoto',
      value: {
        ...toolbarState,
        download: 'enabled',
        save: 'enabled',
        apply: needsCrop ? 'enabled' : 'disabled',
      },
    })
  )

  yield put(markLoaded())
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
  console.log('WATCHING FOR:', uploadImageReady.type)
  yield all([
    takeLatest(toolbarAction.type, handleCardphotoToolbarAction),

    fork(watchCropChanges),

    takeEvery(uploadUserImage.type, onUploadImage),
    takeEvery(cancelFileDialog.type, onCancelFileDialog),

    takeLatest(uploadImageReady.type, onUploadImageReadySaga),
  ])
}
