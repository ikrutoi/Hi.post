import { takeLatest } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { handleCropAction, handleApplyAction } from './cardphotoToolbarHandlers'

function* handleCardphotoToolbarAction(
  action: ReturnType<typeof toolbarAction>
) {
  const { section, key } = action.payload
  if (section !== 'cardphoto') return

  switch (key) {
    case 'crop':
      yield* handleCropAction()
      break

    case 'apply':
      yield* handleApplyAction()
      break
  }
}

export function* cardphotoToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleCardphotoToolbarAction)
}
