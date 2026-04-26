import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { setCardPieListPanelOpen } from '@date/calendar/infrastructure/state'
import { selectIsCardPieListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { selectPieProgress } from '@entities/cardEditor/infrastructure/selectors'
import {
  handleAddDraftsAction,
  handleClearAllMiniSectionsAction,
} from './editorPieHandlers'
import { EditorPieKey, ToolbarSection } from '@/features/toolbar/domain/types'
import { createPostcardsFromEditor } from './postcardCreateSaga'

export function* handleEditorPieToolbarAction(
  action: PayloadAction<{ section: ToolbarSection; key: EditorPieKey }>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'editorPie') return
  switch (key) {
    case 'listCardPie': {
      const listOpen: boolean = yield select(selectIsCardPieListPanelOpen)
      const nextOpen = !listOpen
      yield put(setCardPieListPanelOpen(nextOpen))
      yield put(
        updateToolbarIcon({
          section: 'editorPie',
          key: 'listCardPie',
          value: nextOpen ? 'active' : 'enabled',
        }),
      )
      yield put(
        updateToolbarIcon({
          section: 'date',
          key: 'listCardPie',
          value: nextOpen ? 'active' : 'enabled',
        }),
      )
      break
    }

    case 'addCart': {
      const { isAllComplete } = yield select(selectPieProgress)
      if (!isAllComplete) break
      yield call(createPostcardsFromEditor)
      break
    }

    case 'addDrafts':
      yield call(handleAddDraftsAction)
      break

    case 'close':
      yield call(handleClearAllMiniSectionsAction)
      break

  }
}
