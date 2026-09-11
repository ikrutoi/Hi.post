import { call, put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { RootState } from '@app/state'
import { store } from '@app/state/store'
import type { PostcardHydrated } from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import {
  selectCartItems,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import {
  removeCartPostcard,
  removeItem,
  setCartListSelectedLocalId,
  setCartListStatusSegment,
} from '@cart/infrastructure/state'
import { resolveArchiveSelectionAdvance } from '@date/application/helpers/archiveSelectionAfterRemove'
import { syncArchiveCenterPostcardCalendarView } from '@date/calendar/application/logic/archiveCenterCalendarSync'
import { setHistoryListSelectedLocalId } from '@date/calendar/infrastructure/state'
import { applyRightListArchiveToolbarVisuals } from '@toolbar/application/syncRightListArchiveToolbarVisuals'
import { refreshRightSidebarBadgesFromPostcards } from './postcardCreateSaga'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'

function* applyArchiveSelectionAdvance(
  advance: NonNullable<ReturnType<typeof resolveArchiveSelectionAdvance>>,
): SagaIterator {
  if (advance.cart != null) {
    const currentSegment: ReturnType<typeof selectCartListStatusSegment> =
      yield select(selectCartListStatusSegment)
    if (currentSegment !== advance.cart.segment) {
      yield put(setCartListStatusSegment(advance.cart.segment))
    }
    yield put(setCartListSelectedLocalId(advance.cart.localId))
  }

  if (advance.historyLocalId !== undefined) {
    yield put(setHistoryListSelectedLocalId(advance.historyLocalId))
  }

  const nextArchiveLocalId =
    advance.historyLocalId ?? advance.cart?.localId ?? null
  if (nextArchiveLocalId != null && advance.archiveSource != null) {
    yield call(
      applyRightListArchiveToolbarVisuals,
      store.dispatch,
      store.getState,
      advance.archiveSource,
    )
    syncArchiveCenterPostcardCalendarView(
      store.dispatch,
      store.getState(),
      nextArchiveLocalId,
      { includeDayPanel: false },
    )
  }
}

function* handleRemoveCartPostcard(
  action: ReturnType<typeof removeCartPostcard>,
): SagaIterator {
  const localId = action.payload
  const stateBefore: RootState = yield select()
  const items: PostcardHydrated[] = selectCartItems(stateBefore)
  const row = items.find((p) => p.localId === localId)
  if (!row?.id) return

  const selectionAdvance = resolveArchiveSelectionAdvance(stateBefore, localId)

  try {
    yield call([postcardsAdapter, 'deleteById'], row.id)
  } catch (e) {
    console.error('removeCartPostcard: IDB delete failed', e)
    return
  }

  yield put(removeItem(localId))

  if (selectionAdvance != null) {
    yield* applyArchiveSelectionAdvance(selectionAdvance)
  }

  yield call(refreshRightSidebarBadgesFromPostcards)
  yield put(postcardLocalDataChanged())
}

export function* watchCartRemove(): SagaIterator {
  yield takeEvery(removeCartPostcard.type, handleRemoveCartPostcard)
}
