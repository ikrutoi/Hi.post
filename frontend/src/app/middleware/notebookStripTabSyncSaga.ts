import type { SagaIterator } from 'redux-saga'
import { put, select, takeEvery } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import { setCartListSelectedLocalId } from '@cart/infrastructure/state'
import {
  closeDayPanel,
  openDayPanel,
  setHistoryListSelectedLocalId,
  setNotebookStripDateOverCart,
  setNotebookStripDateOverHistory,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import {
  notebookActiveSectionChanged,
  notebookCartPanelOpenChanged,
  notebookHistoryPanelOpenChanged,
} from '@date/calendar/application/orchestration/notebookOrchestration.events'
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
      notebookActiveSectionChanged.type,
      notebookCartPanelOpenChanged.type,
      setCartListSelectedLocalId.type,
      notebookHistoryPanelOpenChanged.type,
      setHistoryListSelectedLocalId.type,
      openDayPanel.type,
      closeDayPanel.type,
      setNotebookStripDateOverCart.type,
      setNotebookStripDateOverHistory.type,
    ],
    syncNotebookStripTab,
  )
}
