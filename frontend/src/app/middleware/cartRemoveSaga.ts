import { call, put, select, takeLeading } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { RootState } from '@app/state'
import { store } from '@app/state/store'
import type { PostcardHydrated } from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  commitCartPostcardRemoval,
  removeCartPostcard,
} from '@cart/infrastructure/state'
import { resolveArchiveSelectionAdvance } from '@date/application/helpers/archiveSelectionAfterRemove'
import { syncArchiveCenterPostcardCalendarView } from '@date/calendar/application/logic/archiveCenterCalendarSync'
import {
  selectHistoryListSelectedLocalId,
} from '@date/calendar/infrastructure/selectors'
import { setHistoryListSelectedLocalId } from '@date/calendar/infrastructure/state'
import { applyRightListArchiveToolbarVisuals } from '@toolbar/application/syncRightListArchiveToolbarVisuals'
import { refreshRightSidebarBadgesFromPostcards } from './postcardCreateSaga'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'

function* handleRemoveCartPostcard(
  action: ReturnType<typeof removeCartPostcard>,
): SagaIterator {
  const localId = action.payload
  const stateBefore: RootState = yield select()
  const items: PostcardHydrated[] = selectCartItems(stateBefore)
  const row = items.find((p) => p.localId === localId)
  if (row == null) return

  const selectionAdvance = resolveArchiveSelectionAdvance(stateBefore, localId)

  if (row.id) {
    try {
      yield call([postcardsAdapter, 'deleteById'], row.id)
    } catch (e) {
      console.error('removeCartPostcard: IDB delete failed', e)
    }
  }

  if (selectionAdvance?.historyLocalId !== undefined) {
    yield put(setHistoryListSelectedLocalId(selectionAdvance.historyLocalId))
  } else if (selectHistoryListSelectedLocalId(stateBefore) === localId) {
    yield put(setHistoryListSelectedLocalId(null))
  }

  yield put(
    commitCartPostcardRemoval({
      removedLocalId: localId,
      nextCart: selectionAdvance?.cart,
    }),
  )

  const nextArchiveLocalId =
    selectionAdvance?.historyLocalId ??
    selectionAdvance?.cart?.localId ??
    null
  if (nextArchiveLocalId != null && selectionAdvance?.archiveSource != null) {
    yield call(
      applyRightListArchiveToolbarVisuals,
      store.dispatch,
      store.getState,
      selectionAdvance.archiveSource,
    )
    syncArchiveCenterPostcardCalendarView(
      store.dispatch,
      store.getState(),
      nextArchiveLocalId,
      { includeDayPanel: false },
    )
  }

  yield call(refreshRightSidebarBadgesFromPostcards)
  yield put(postcardLocalDataChanged())
}

export function* watchCartRemove(): SagaIterator {
  yield takeLeading(removeCartPostcard.type, handleRemoveCartPostcard)
}
