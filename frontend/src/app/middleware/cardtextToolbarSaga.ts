import { SagaIterator } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { setComplete } from '@cardtext/infrastructure/state'
import { changeFontSizeStep } from './cardtextHandlers'
import { syncCardOrientationStatus } from './cardtextProcessSaga'

export function* handleCardtextToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key, payload: editor } = action.payload
  if (section !== 'cardtext') return
  // if (section !== 'cardtext' || !editor) return

  switch (key) {
    case 'apply':
      yield put(setComplete(true))
      break

    case 'fontSizeLess':
      yield call(changeFontSizeStep, editor, 'less')
      break

    case 'fontSizeMore':
      yield call(changeFontSizeStep, editor, 'more')
      break
  }
}

// function applyFontSize(editor: Editor, size: number) {
//   Transforms.setNodes(
//     editor,
//     { fontSize: size },
//     { match: (n) => Text.isText(n), split: true },
//   )
// }
