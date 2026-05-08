import { all, put, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import {
  setHistoryListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'

function* handleHistoryToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'history' || key !== 'history') return

  const listOpen: boolean = yield select(selectIsHistoryListPanelOpen)
  yield put(setHistoryListPanelOpen(!listOpen))
}

export function* watchHistoryToolbar(): SagaIterator {
  yield all([
    takeEvery(toolbarAction.type, handleHistoryToolbarAction),
  ])
}
