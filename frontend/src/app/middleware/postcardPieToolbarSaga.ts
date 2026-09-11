import { put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { RootState } from '@app/state'
import { toolbarAction } from '@toolbar/application/helpers'
import { removeCartPostcard } from '@cart/infrastructure/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { readDisplayedRightListArchivePostcardLocalId } from '@date/calendar/infrastructure/selectors'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'

function* handlePostcardPieToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'postcardPieCart' && section !== 'postcardPieHistory') return
  if (key !== 'delete') return

  const state: RootState = yield select()
  const isMobileLayout: boolean = yield select(selectIsMobileLayout)
  const localId = readDisplayedRightListArchivePostcardLocalId(state, {
    isMobileLayout,
    activePieSideRight: true,
    pinnedLocalId: null,
  })
  if (localId == null) return
  if (!selectCartItems(state).some((item) => item.localId === localId)) return

  yield put(removeCartPostcard(localId))
}

export function* watchPostcardPieToolbar(): SagaIterator {
  yield takeEvery(toolbarAction.type, handlePostcardPieToolbarAction)
}
