import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { selectIsHistoryListPanelOpen, selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { closeCardPieListPanelAndSyncIconsSaga } from '@app/middleware/exclusiveListPanelsSaga'
import {
  notebookSessionRestored,
  notebookTabCartClicked,
  notebookTabDateClicked,
  notebookTabHistoryClicked,
} from '@date/calendar/application/orchestration/notebookOrchestration.events'
import { bumpNotebookDateTabPeekClearTick } from '@date/calendar/infrastructure/state'
import {
  buildCartArchiveToggleCommands,
  buildHistoryArchiveToggleCommands,
  buildNotebookDateTabCommands,
  buildNotebookDateTabCommandsMobile,
  buildNotebookSessionRestoreCommands,
} from '@date/calendar/application/orchestration/notebookOrchestration.rules'

function* dispatchCommands(commands: ReturnType<typeof buildNotebookDateTabCommands>) {
  for (const command of commands) {
    yield put(command)
  }
}

function* handleNotebookTabDateClicked(): SagaIterator {
  const isMobileLayout: boolean = yield select(selectIsMobileLayout)
  if (isMobileLayout) {
    yield call(closeCardPieListPanelAndSyncIconsSaga)
    yield* dispatchCommands(buildNotebookDateTabCommandsMobile())
  } else {
    yield* dispatchCommands(buildNotebookDateTabCommands())
  }
  yield put(bumpNotebookDateTabPeekClearTick())
}

function* handleNotebookTabCartClicked(): SagaIterator {
  const isMobileLayout: boolean = yield select(selectIsMobileLayout)
  const cartListPanelOpen: boolean = yield select(selectCartListPanelOpen)
  const notebookStripTab = yield select(selectNotebookStripTab)
  if (isMobileLayout) {
    yield call(closeCardPieListPanelAndSyncIconsSaga)
  }
  yield* dispatchCommands(
    buildCartArchiveToggleCommands({
      cartListPanelOpen,
      notebookStripTab,
      isMobileLayout,
    }),
  )
}

function* handleNotebookTabHistoryClicked(): SagaIterator {
  const isMobileLayout: boolean = yield select(selectIsMobileLayout)
  const historyListPanelOpen: boolean = yield select(selectIsHistoryListPanelOpen)
  const notebookStripTab = yield select(selectNotebookStripTab)
  const activeSection = yield select(selectActiveSection)
  if (isMobileLayout) {
    yield call(closeCardPieListPanelAndSyncIconsSaga)
  }
  yield* dispatchCommands(
    buildHistoryArchiveToggleCommands({
      historyListPanelOpen,
      notebookStripTab,
      activeSection,
      isMobileLayout,
    }),
  )
}

function* handleNotebookSessionRestored(
  action: ReturnType<typeof notebookSessionRestored>,
): SagaIterator {
  yield* dispatchCommands(buildNotebookSessionRestoreCommands(action.payload.tab))
}

export function* watchNotebookOrchestrator(): SagaIterator {
  yield takeEvery(notebookTabDateClicked.type, handleNotebookTabDateClicked)
  yield takeEvery(notebookTabCartClicked.type, handleNotebookTabCartClicked)
  yield takeEvery(notebookTabHistoryClicked.type, handleNotebookTabHistoryClicked)
  yield takeEvery(notebookSessionRestored.type, handleNotebookSessionRestored)
}
