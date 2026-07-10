import { call, put, select, takeEvery } from 'redux-saga/effects'
import type { SagaIterator } from 'redux-saga'
import type { PostcardHydrated } from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { cyclePostcardDebugStatus, updateItem } from '@cart/infrastructure/state'
import { refreshRightSidebarBadgesFromPostcards } from './postcardCreateSaga'
import { postcardLocalDataChanged } from '@features/sync/store/postcardSync.actions'
import {
  isDebugPostcardStatusCycleEnabled,
  nextDebugPostcardStatus,
} from '@date/application/helpers/debugPostcardStatusCycle'

function* handleCyclePostcardDebugStatus(
  action: ReturnType<typeof cyclePostcardDebugStatus>,
): SagaIterator {
  if (!isDebugPostcardStatusCycleEnabled) return

  const localId = action.payload
  const items: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = items.find((p) => p.localId === localId)
  if (postcard == null) return

  const nextStatus = nextDebugPostcardStatus(postcard.status)
  const next: PostcardHydrated = {
    ...postcard,
    status: nextStatus,
    updatedAt: Date.now(),
  }

  yield call([postcardsAdapter, 'put'], next)
  yield put(updateItem(next))
  yield call(refreshRightSidebarBadgesFromPostcards)
  yield put(postcardLocalDataChanged())
}

export function* watchCartDebugStatus(): SagaIterator {
  yield takeEvery(cyclePostcardDebugStatus.type, handleCyclePostcardDebugStatus)
}
