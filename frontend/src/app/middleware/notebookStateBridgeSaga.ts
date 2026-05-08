import type { SagaIterator } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import {
  resetActiveSection,
  restoreEditorSession,
  setActiveSection,
} from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import { setHistoryListPanelOpen } from '@date/calendar/infrastructure/state'
import {
  notebookActiveSectionChanged,
  notebookCartPanelOpenChanged,
  notebookHistoryPanelOpenChanged,
} from '@date/calendar/application/orchestration/notebookOrchestration.events'

function* handleActiveSectionChanged(
  action: ReturnType<typeof setActiveSection>,
): SagaIterator {
  yield put(notebookActiveSectionChanged({ activeSection: action.payload }))
}

function* handleEditorSessionRestored(
  action: ReturnType<typeof restoreEditorSession>,
): SagaIterator {
  yield put(notebookActiveSectionChanged({ activeSection: action.payload }))
}

function* handleActiveSectionReset(): SagaIterator {
  yield put(notebookActiveSectionChanged({ activeSection: null }))
}

function* handleCartPanelOpenChanged(
  action: ReturnType<typeof setCartListPanelOpen>,
): SagaIterator {
  yield put(notebookCartPanelOpenChanged({ isOpen: action.payload }))
}

function* handleHistoryPanelOpenChanged(
  action: ReturnType<typeof setHistoryListPanelOpen>,
): SagaIterator {
  yield put(notebookHistoryPanelOpenChanged({ isOpen: action.payload }))
}

export function* watchNotebookStateBridge(): SagaIterator {
  yield takeEvery(setActiveSection.type, handleActiveSectionChanged)
  yield takeEvery(restoreEditorSession.type, handleEditorSessionRestored)
  yield takeEvery(resetActiveSection.type, handleActiveSectionReset)
  yield takeEvery(setCartListPanelOpen.type, handleCartPanelOpenChanged)
  yield takeEvery(setHistoryListPanelOpen.type, handleHistoryPanelOpenChanged)
}
