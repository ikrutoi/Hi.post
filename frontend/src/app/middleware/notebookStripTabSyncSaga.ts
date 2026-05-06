import type { SagaIterator } from 'redux-saga'
import { put, select, takeEvery } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import {
  setActiveSection,
  resetActiveSection,
  restoreEditorSession,
} from '@entities/sectionEditorMenu/infrastructure/state'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import {
  setHistoryListPanelOpen,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import { computeNotebookStripTabFromState } from '@date/calendar/infrastructure/selectors'

function* syncNotebookStripTab(): SagaIterator {
  const state: RootState = yield select()
  const next = computeNotebookStripTabFromState(state)
  if (state.calendar.notebookStripTab !== next) {
    yield put(setNotebookStripTab(next))
  }
}

export function* watchNotebookStripTabSync(): SagaIterator {
  yield takeEvery(
    [
      setActiveSection.type,
      resetActiveSection.type,
      restoreEditorSession.type,
      setCartListPanelOpen.type,
      setHistoryListPanelOpen.type,
    ],
    syncNotebookStripTab,
  )
}
