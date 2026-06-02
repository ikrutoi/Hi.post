import { call, put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PostcardHydrated } from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { removeCartPostcard, removeItem } from '@cart/infrastructure/state'
import { refreshRightSidebarBadgesFromPostcards } from './postcardCreateSaga'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'

function* handleRemoveCartPostcard(
  action: ReturnType<typeof removeCartPostcard>,
): SagaIterator {
  const localId = action.payload
  const items: PostcardHydrated[] = yield select(selectCartItems)
  const row = items.find((p) => p.localId === localId)
  if (!row?.id) return

  try {
    yield call([postcardsAdapter, 'deleteById'], row.id)
  } catch (e) {
    console.error('removeCartPostcard: IDB delete failed', e)
    return
  }

  yield put(removeItem(localId))
  yield call(refreshRightSidebarBadgesFromPostcards)
  yield put(postcardLocalDataChanged())
}

export function* watchCartRemove(): SagaIterator {
  yield takeEvery(removeCartPostcard.type, handleRemoveCartPostcard)
}
