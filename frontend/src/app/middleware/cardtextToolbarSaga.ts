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
  setCardtextFocusRequested,
  setCardtextShowViewMode,
} from '@cardtext/infrastructure/state'
import { selectCardtextValue, selectCardtextShowViewMode } from '@cardtext/infrastructure/selectors'

export function* handleCardtextToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key, payload: editor } = action.payload
  const isCardtextSection = section === 'cardtext' || section === 'cardtextView'
  if (!isCardtextSection) return

  switch (key) {
    case 'apply':
      yield put(setComplete(true))
      break

    case 'edit':
      if (section === 'cardtextView') {
        yield put(setCardtextShowViewMode(false))
      }
      break

    case 'fontSizeLess':
      if (section === 'cardtext') yield call(changeFontSizeStep, editor, 'less')
      break

    case 'fontSizeMore':
      if (section === 'cardtext') yield call(changeFontSizeStep, editor, 'more')
      break

    case 'listCardtext': {
      const current: any = (yield select(
        (state: RootState) => state.toolbar[section].listCardtext,
      )) as any
      const isActive =
        current?.state === 'active' || current === 'active'
      const nextState = isActive ? 'enabled' : 'active'

      yield put(
        updateToolbarIcon({
          section,
          key: 'listCardtext',
          value: nextState,
        }),
      )
      yield put(setCardtextListPanelOpen(!isActive))
      break
    }

    case 'listAdd':
      yield put(setCardtextSaveTemplateModalOpen(true))
      break

    case 'cardtextAdd': {
      const value: any = yield select(selectCardtextValue)
      const showViewMode: boolean = yield select(selectCardtextShowViewMode)
      const isEmpty =
        !showViewMode &&
        (!value?.length ||
          (value.length === 1 &&
            !(value[0]?.children?.map((c: any) => c?.text).join('') ?? '').trim()))
      if (isEmpty) {
        yield put(setCardtextFocusRequested(true))
      }
      break
    }
  }
}

// function applyFontSize(editor: Editor, size: number) {
//   Transforms.setNodes(
//     editor,
//     { fontSize: size },
//     { match: (n) => Text.isText(n), split: true },
//   )
// }
