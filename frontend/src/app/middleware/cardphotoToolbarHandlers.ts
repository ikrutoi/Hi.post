import { put, select } from 'redux-saga/effects'
import { addOperation } from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import {
  selectCrop,
  selectOrientation,
} from '@cardphoto/infrastructure/selectors'
import { updateCropToolbarState } from './cardphotoToolbarHelpers'
import { getCroppedBase64 } from '@cardphoto/application/helpers'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type {
  ImageOperation,
  CropState,
  Orientation,
  ImageMeta,
} from '@cardphoto/domain/types'

export function* handleCropAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  const newCrop = state.crop === 'enabled' ? 'active' : 'enabled'

  yield* updateCropToolbarState(newCrop, state)
}

export function* handleCropCheckAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )
  if (state.crop !== 'active') return

  const crop: CropState = yield select(selectCrop)
  const orientation: Orientation = yield select(selectOrientation)

  const imageMeta: ImageMeta = yield select(
    (s) => s.cardphoto.history.finalImage || s.cardphoto.history.original
  )

  const img = new Image()

  img.src = imageMeta.url
  yield new Promise((resolve) => {
    img.onload = resolve
  })

  const croppedBase64 = getCroppedBase64(
    img,
    { x: crop.left, y: crop.top, width: crop.width, height: crop.height },
    1, // scaleX
    1 // scaleY
  )

  const newImage: ImageMeta = {
    id: imageMeta.id + '-crop',
    url: croppedBase64,
    width: crop.width,
    height: crop.height,
    source: imageMeta.source,
  }

  const operation: ImageOperation = {
    type: 'crop',
    payload: {
      area: {
        x: crop.left,
        y: crop.top,
        width: crop.width,
        height: crop.height,
      },
      orientation,
    },
  }

  yield put(addOperation(operation))

  yield put({
    type: 'cardphoto/setFinalImage',
    payload: newImage,
  })

  yield* updateCropToolbarState('enabled', state)
}
