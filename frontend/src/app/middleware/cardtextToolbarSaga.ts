import { takeLatest, put } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { clear } from '@cardtext/infrastructure/state'

function* handleCardtextToolbarAction(
  action: ReturnType<typeof toolbarAction>
) {
  const { section, key } = action.payload
  if (section !== 'cardtext') return

  switch (key) {
    case 'save':
      console.log('Saving cardtext...')
      break

    case 'close':
      yield put(clear())
      break

    case 'textTemplates':
      console.log('Open text templates...')
      break
  }
}

export function* cardtextToolbarSaga() {
  yield takeLatest(toolbarAction.type, handleCardtextToolbarAction)
}
