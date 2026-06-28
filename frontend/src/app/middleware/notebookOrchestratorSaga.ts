import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'
import { closeCardPieListPanelAndSyncIconsSaga } from '@app/middleware/exclusiveListPanelsSaga'
import {
  notebookSessionRestored,
  notebookTabCartClicked,
  notebookTabDateClicked,
  notebookTabHistoryClicked,
} from '@date/calendar/application/orchestration/notebookOrchestration.events'
import { bumpNotebookDateTabPeekClearTick } from '@date/calendar/infrastructure/state'
import {
  buildNotebookCartTabCommands,
  buildNotebookCartTabCommandsMobile,
  buildNotebookDateTabCommands,
  buildNotebookDateTabCommandsMobile,
  buildNotebookHistoryTabCommands,
  buildNotebookHistoryTabCommandsMobile,
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
  if (isMobileLayout) {
    yield call(closeCardPieListPanelAndSyncIconsSaga)
    yield* dispatchCommands(buildNotebookCartTabCommandsMobile())
    return
  }
  yield* dispatchCommands(buildNotebookCartTabCommands())
}

function* handleNotebookTabHistoryClicked(): SagaIterator {
  const isMobileLayout: boolean = yield select(selectIsMobileLayout)
  if (isMobileLayout) {
    yield call(closeCardPieListPanelAndSyncIconsSaga)
    yield* dispatchCommands(buildNotebookHistoryTabCommandsMobile())
    return
  }
  yield* dispatchCommands(buildNotebookHistoryTabCommands())
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
