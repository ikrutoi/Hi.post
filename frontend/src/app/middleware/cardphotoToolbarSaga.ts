import { call, takeLatest, all, fork, select } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { addOperation } from '@cardphoto/infrastructure/state'
import {
  handleCropAction,
  handleCropCheckAction,
  handleCardOrientation,
  handleImageRotate,
  handleCropFullAction,
  syncCropFullIcon,
} from './cardphotoToolbarHandlers'

export function* watchCropChanges(): SagaIterator {
  yield takeLatest(addOperation.type, syncCropFullIcon)
}

function* handleCardphotoToolbarAction(
  action: ReturnType<typeof toolbarAction>
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'cardphoto') return

  switch (key) {
    case 'crop':
      yield* handleCropAction()
      break
    case 'cropCheck':
      yield call(handleCropCheckAction)
      break
    case 'cropFull':
      yield call(handleCropFullAction)
      break
    case 'cardOrientation':
      yield call(handleCardOrientation)
      break
    case 'imageRotateLeft':
    case 'imageRotateRight':
      yield call(handleImageRotate, key)
      break
  }
}

export function* cardphotoToolbarSaga(): SagaIterator {
  yield all([
    fork(watchCropChanges),
    takeLatest(toolbarAction.type, handleCardphotoToolbarAction),
  ])
}
