import { all, put, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { setCartListPanelOpen } from '@cart/infrastructure/state'

function* handleCartToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'cart' || key !== 'cart') return

  const listOpen: boolean = yield select(selectCartListPanelOpen)
  yield put(setCartListPanelOpen(!listOpen))
}

export function* watchCartToolbar(): SagaIterator {
  yield all([takeEvery(toolbarAction.type, handleCartToolbarAction)])
}
