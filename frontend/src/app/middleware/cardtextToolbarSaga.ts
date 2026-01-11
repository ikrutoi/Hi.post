import { SagaIterator } from 'redux-saga'
import { takeLatest, put, call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { clear } from '@cardtext/infrastructure/state'
import { updateGroupStatus } from '@toolbar/infrastructure/state'
import { toggleMark, setAlign } from '@cardtext/application/commands'

function* handleCardtextToolbarAction(
  action: ReturnType<typeof toolbarAction>
): SagaIterator {
  const { section, key, payload: editor } = action.payload

  if (section !== 'cardtext' || !editor) return

  switch (key) {
    case 'bold':
    case 'italic':
    case 'underline':
      yield call(toggleMark, editor, key)
      break

    case 'left':
    case 'center':
    case 'right':
    case 'justify':
      yield call(setAlign, editor, key)
      break

    case 'close':
      yield put(clear())
      yield put(
        updateGroupStatus({
          section: 'cardtext',
          groupName: 'text',
          status: 'disabled',
        })
      )
      break

    case 'save':
      console.log('Saving...')
      break
  }
}

export function* cardtextToolbarSaga(): SagaIterator {
  yield takeLatest(toolbarAction.type, handleCardtextToolbarAction)
}
