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
import {
  updateToolbarSection,
  updateToolbarIcon,
} from '@toolbar/infrastructure/state'
import {
  selectToolbarSectionState,
  selectToolbarIconState,
} from '@toolbar/infrastructure/selectors'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ImageMeta } from '@cardphoto/domain/types'
import type { SizeCard } from '@layout/domain/types'

function* onDownloadClick(action: ReturnType<typeof toolbarAction>) {
  const { section, key } = action.payload
  if (section !== 'cardphoto' || key !== 'download') return

  // const state: CardphotoToolbarState = yield select(
  //   selectToolbarSectionState('cardphoto')
  // )

  // yield put(
  //   updateToolbarSection({
  //     section: 'cardphoto',
  //     value: { ...state, download: 'disabled' },
  //   })
  // )
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

  // console.log('saga Upload', imageMeta)
  // yield put(
  //   resetCrop({
  //     imageWidth: imageMeta.width,
  //     imageHeight: imageMeta.height,
  //     imageLeft: 0,
  //     imageTop: 0,
  //     imageId: imageMeta.id,
  //   })
  // )

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
  console.log('onCancel')
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
