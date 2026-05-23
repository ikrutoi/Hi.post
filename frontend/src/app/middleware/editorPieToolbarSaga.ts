import { SagaIterator } from 'redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'
import { call, put, select } from 'redux-saga/effects'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { setCardPieListPanelOpen } from '@date/calendar/infrastructure/state'
import { selectIsCardPieListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { EditorPieKey, ToolbarSection } from '@/features/toolbar/domain/types'
import { clearCardPieWorkspaceAfterCartAdd } from './editorPieHandlers'

export function* handleEditorPieToolbarAction(
  action: PayloadAction<{ section: ToolbarSection; key: EditorPieKey }>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'editorPie') return
  switch (key) {
    case 'cardPie': {
      const listOpen: boolean = yield select(selectIsCardPieListPanelOpen)
      const nextOpen = !listOpen
      yield put(setCardPieListPanelOpen(nextOpen))
      yield put(
        updateToolbarIcon({
          section: 'editorPie',
          key: 'cardPie',
          value: nextOpen ? 'active' : 'enabled',
        }),
      )
      yield put(
        updateToolbarIcon({
          section: 'date',
          key: 'cardPie',
          value: nextOpen ? 'active' : 'enabled',
        }),
      )
      break
    }
    case 'delete': {
      yield call(clearCardPieWorkspaceAfterCartAdd)
      break
    }
  }
}
