import { takeEvery, put, select } from 'redux-saga/effects'
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
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ImageMeta, CardLayer } from '@cardphoto/domain/types'

import {
  fitImageToCard,
  createInitialCropLayer,
} from '@cardphoto/application/utils/imageFit'

function* onDownloadClick(action: ReturnType<typeof toolbarAction>) {
  const { section, key } = action.payload
  if (section !== 'cardphoto' || key !== 'download') return

  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'download',
      value: 'disabled',
    })
  )
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'crop', value: 'enabled' })
  )
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'save', value: 'disabled' })
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

function* onCancelFileDialog() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )
  const newState = { ...state, download: 'enabled', save: 'enabled' }

  yield put(updateToolbarSection({ section: 'cardphoto', value: newState }))
  yield put(markLoaded())
}

export function* cardphotoUiSaga() {
  yield takeEvery(toolbarAction.type, onDownloadClick)
  yield takeEvery(uploadUserImage.type, onUploadImage)
  yield takeEvery(cancelFileDialog.type, onCancelFileDialog)
}
