import { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { setComplete } from '@cardtext/infrastructure/state'
import { changeFontSizeStep } from './cardtextHandlers'
import { syncCardOrientationStatus } from './cardtextProcessSaga'
import type { RootState } from '@app/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  setCardtextListPanelOpen,
  setCardtextSaveTemplateModalOpen,
} from '@cardtext/infrastructure/state'

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

    case 'listCardtext': {
      // Toggle icon state between 'active' and 'enabled' so UI reflects open/closed list panel.
      const current: any = (yield select(
        (state: RootState) => state.toolbar.cardtext.listCardtext,
      )) as any
      const isActive =
        current?.state === 'active' || current === 'active'
      const nextState = isActive ? 'enabled' : 'active'

      yield put(
        updateToolbarIcon({
          section: 'cardtext',
          key: 'listCardtext',
          value: nextState,
        }),
      )
      // Sync list panel visibility with icon state
      yield put(setCardtextListPanelOpen(!isActive))
      break
    }

    case 'listAdd':
      yield put(setCardtextSaveTemplateModalOpen(true))
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
