import { takeLatest, put } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { addOperation } from '@cardphoto/infrastructure/state'
import { handleCropAction } from './cardphotoToolbarHandlers'

function* handleCardphotoToolbarAction(
  action: ReturnType<typeof toolbarAction>
) {
  const { section, key } = action.payload
  if (section !== 'cardphoto') return

  switch (key) {
    case 'crop':
      yield* handleCropAction()
      break

    case 'rotate':
      yield put(addOperation({ type: 'rotate', payload: { angle: 90 } }))
      break
  }
}

export function* cardphotoToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleCardphotoToolbarAction)
}
