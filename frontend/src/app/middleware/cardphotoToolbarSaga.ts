import { call, takeLatest } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  handleCropAction,
  handleCropCheckAction,
  handleCardOrientation,
  handleImageRotate,
} from './cardphotoToolbarHandlers'

function* handleCardphotoToolbarAction(
  action: ReturnType<typeof toolbarAction>
) {
  const { section, key } = action.payload
  if (section !== 'cardphoto') return

  // console.log('key', key)

  switch (key) {
    case 'crop':
      yield* handleCropAction()
      break

    case 'cropCheck':
      yield* handleCropCheckAction()
      break

    case 'cardOrientation':
      yield call(handleCardOrientation)
      break

    case 'imageRotateRight':
      yield call(handleImageRotate)
      break
  }
}

export function* cardphotoToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleCardphotoToolbarAction)
}
