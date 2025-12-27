import { takeEvery, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  openFileDialog,
  uploadImage,
  setActiveImage,
  cancelFileDialog,
  markLoading,
  markLoaded,
  setNeedsCrop,
  // resetCrop,
} from '@cardphoto/infrastructure/state'
import { validateImageSize } from '@cardphoto/application/helpers'
import { selectSizeCard } from '@layout/infrastructure/selectors'
import { updateToolbarSection } from '@toolbar/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ImageMeta } from '@cardphoto/domain/types'
import type { SizeCard } from '@layout/domain/types'

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
  yield put(markLoading())
}

function* onUploadImage(action: PayloadAction<ImageMeta>) {
  const imageMeta = action.payload
  if (!imageMeta) return

  yield put(setActiveImage(imageMeta))
  yield put(markLoaded())

  const sizeCard: SizeCard = yield select(selectSizeCard)

  if (!sizeCard) return

  const { needsCrop } = validateImageSize(
    imageMeta,
    sizeCard.width,
    sizeCard.height
  )
  yield put(setNeedsCrop(needsCrop))

  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  const newState = {
    ...state,
    download: 'enabled',
    apply: needsCrop ? 'enabled' : 'disabled',
  }

  yield put(updateToolbarSection({ section: 'cardphoto', value: newState }))
}

function* onCancelFileDialog() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )
  yield put(
    updateToolbarSection({
      section: 'cardphoto',
      value: { ...state, download: 'enabled' },
    })
  )
  yield put(markLoaded())
}

export function* cardphotoUiSaga() {
  yield takeEvery(toolbarAction.type, onDownloadClick)
  yield takeEvery(uploadImage.type, onUploadImage)
  yield takeEvery(cancelFileDialog.type, onCancelFileDialog)
}
