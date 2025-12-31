import { put, select } from 'redux-saga/effects'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { addOperation } from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import {
  selectCrop,
  selectOrientation,
} from '@cardphoto/infrastructure/selectors'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type {
  ImageOperation,
  CropState,
  Orientation,
} from '@cardphoto/domain/types'

export function* handleCropAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  const newCrop = state.crop === 'enabled' ? 'active' : 'enabled'
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'crop', value: newCrop })
  )

  const currentSave = state.save
  const newSave =
    newCrop === 'active'
      ? 'disabled'
      : currentSave === 'disabled'
        ? 'enabled'
        : currentSave
  yield put(
    updateToolbarIcon({ section: 'cardphoto', key: 'save', value: newSave })
  )

  const currentCropFull = state.cropFull
  const newCropFull =
    newCrop === 'active'
      ? 'enabled'
      : currentCropFull === 'enabled'
        ? 'disabled'
        : currentCropFull
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropFull',
      value: newCropFull,
    })
  )

  const currentCropCheck = state.cropCheck
  const newCropCheck =
    newCrop === 'active'
      ? 'enabled'
      : currentCropCheck === 'enabled'
        ? 'disabled'
        : currentCropCheck
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropCheck',
      value: newCropCheck,
    })
  )

  const currentCropRotate = state.cropRotate
  const newCropRotate =
    newCrop === 'active'
      ? 'enabled'
      : currentCropRotate === 'enabled'
        ? 'disabled'
        : currentCropRotate
  yield put(
    updateToolbarIcon({
      section: 'cardphoto',
      key: 'cropRotate',
      value: newCropRotate,
    })
  )
}

export function* handleApplyAction() {
  const state: CardphotoToolbarState = yield select(
    selectToolbarSectionState('cardphoto')
  )

  if (state.crop === 'active') {
    const crop: CropState = yield select(selectCrop)
    const orientation: Orientation = yield select(selectOrientation)

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

    yield put(
      updateToolbarIcon({ section: 'cardphoto', key: 'crop', value: 'enabled' })
    )
    yield put(
      updateToolbarIcon({ section: 'cardphoto', key: 'save', value: 'enabled' })
    )
  }
}
