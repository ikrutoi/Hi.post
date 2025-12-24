import { takeEvery, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  openFileDialog,
  uploadImage,
  setActiveImage,
} from '@cardphoto/infrastructure/state'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ImageMeta } from '@cardphoto/domain/types'

function* onDownloadClick(action: ReturnType<typeof toolbarAction>) {
  const { section, key } = action.payload
  if (section !== 'cardphoto' || key !== 'download') return

  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )
  yield put(
    updateToolbarSection({
      section: 'cardphoto',
      value: { ...state, download: 'disabled' },
    })
  )

  yield put(openFileDialog())
}

function* onUploadImage(action: PayloadAction<ImageMeta>) {
  const imageMeta = action.payload
  if (!imageMeta) return

  yield put(setActiveImage(imageMeta))

  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )
  yield put(
    updateToolbarSection({
      section: 'cardphoto',
      value: { ...state, download: 'enabled' },
    })
  )
}

export function* cardphotoDownloadSaga() {
  yield takeEvery(toolbarAction.type, onDownloadClick)
  yield takeEvery(uploadImage.type, onUploadImage)
}
