import { put, select } from 'redux-saga/effects'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { addOperation } from '@cardphoto/infrastructure/state'
import { selectToolbarSectionState } from '@toolbar/infrastructure/selectors'
import { selectCrop } from '@cardphoto/infrastructure/selectors'
import type { CardphotoToolbarState } from '@toolbar/domain/types'
import type { ImageOperation, CropState } from '@cardphoto/domain/types'

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

  const crop: CropState = yield select(selectCrop)

  const operation: ImageOperation = {
    type: 'crop',
    payload: {
      x: crop.left,
      y: crop.top,
      width: crop.width,
      height: crop.height,
    },
  }
  yield put(addOperation(operation))
}
