import { put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { removeCartPostcard } from '@cart/infrastructure/state'
import { selectRightListArchivePostcardLocalId } from '@date/calendar/infrastructure/selectors'

function* handlePostcardPieToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'postcardPieCart' && section !== 'postcardPieHistory') return
  if (key !== 'delete') return

  const localId: number | null = yield select(selectRightListArchivePostcardLocalId)
  if (localId == null) return

  yield put(removeCartPostcard(localId))
}

export function* watchPostcardPieToolbar(): SagaIterator {
  yield takeEvery(toolbarAction.type, handlePostcardPieToolbarAction)
}
