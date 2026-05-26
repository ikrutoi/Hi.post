import { put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { removeCartPostcard } from '@cart/infrastructure/state'
import {
  selectHistoryListSelectedLocalId,
  selectRightListArchivePostcardLocalId,
} from '@date/calendar/infrastructure/selectors'
import { setHistoryListSelectedLocalId } from '@date/calendar/infrastructure/state'

function* handlePostcardPieToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'postcardPieCart' && section !== 'postcardPieHistory') return
  if (key !== 'delete') return

  const localId: number | null = yield select(selectRightListArchivePostcardLocalId)
  if (localId == null) return

  const historyListSelectedLocalId: number | null = yield select(
    selectHistoryListSelectedLocalId,
  )

  yield put(removeCartPostcard(localId))

  if (historyListSelectedLocalId === localId) {
    yield put(setHistoryListSelectedLocalId(null))
  }
}

export function* watchPostcardPieToolbar(): SagaIterator {
  yield takeEvery(toolbarAction.type, handlePostcardPieToolbarAction)
}
