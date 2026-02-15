import { SagaIterator } from 'redux-saga'
import { call } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { changeFontSizeStep } from './cardtextHandlers'
import { syncCardOrientationStatus } from './cardtextProcessSaga'

export function* handleCardtextToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key, payload: editor } = action.payload
  if (section !== 'cardtext') return
  // if (section !== 'cardtext' || !editor) return

  switch (key) {
    case 'fontSizeLess':
      yield call(changeFontSizeStep, editor, 'less')
      break

    case 'fontSizeMore':
      yield call(changeFontSizeStep, editor, 'more')
      break
  }
}
