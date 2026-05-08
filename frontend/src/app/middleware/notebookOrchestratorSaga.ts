import type { SagaIterator } from 'redux-saga'
import { put, takeEvery } from 'redux-saga/effects'
import {
  notebookSessionRestored,
  notebookTabCartClicked,
  notebookTabDateClicked,
  notebookTabHistoryClicked,
} from '@date/calendar/application/orchestration/notebookOrchestration.events'
import {
  buildNotebookCartTabCommands,
  buildNotebookDateTabCommands,
  buildNotebookHistoryTabCommands,
  buildNotebookSessionRestoreCommands,
} from '@date/calendar/application/orchestration/notebookOrchestration.rules'

function* dispatchCommands(commands: ReturnType<typeof buildNotebookDateTabCommands>) {
  for (const command of commands) {
    yield put(command)
  }
}

function* handleNotebookTabDateClicked(): SagaIterator {
  yield* dispatchCommands(buildNotebookDateTabCommands())
}

function* handleNotebookTabCartClicked(): SagaIterator {
  yield* dispatchCommands(buildNotebookCartTabCommands())
}

function* handleNotebookTabHistoryClicked(): SagaIterator {
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
