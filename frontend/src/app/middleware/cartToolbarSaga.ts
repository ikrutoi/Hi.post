import { all, call, put, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import type { PostcardHydrated } from '@entities/postcard'
import { cartListBillableLocalIds } from '@cart/application/logic/cartListBillableLocalIds'
import {
  selectCartItems,
  selectCartListCheckedLocalIds,
  selectCartListPanelOpen,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import {
  removeCartPostcard,
  setCartListCheckedLocalIds,
  setCartListPanelOpen,
} from '@cart/infrastructure/state'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { handleRemoveCartPostcard } from './cartRemoveSaga'

let cartListDeleteInFlight = false

function syncCartListCheckBoxToolbarIcon(allChecked: boolean): ReturnType<
  typeof updateToolbarIcon
> {
  return updateToolbarIcon({
    section: 'cartList',
    key: 'checkBox',
    value: allChecked ? 'active' : 'enabled',
  })
}

function* handleCartToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'cart' || key !== 'cart') return

  const listOpen: boolean = yield select(selectCartListPanelOpen)
  yield put(setCartListPanelOpen(!listOpen))
}

function* handleCartListToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'cartList') return

  if (key === 'checkBox') {
    const items: PostcardHydrated[] = yield select(selectCartItems)
    const billableIds = cartListBillableLocalIds(items)
    if (billableIds.length === 0) {
      yield put(setCartListCheckedLocalIds([]))
      yield put(syncCartListCheckBoxToolbarIcon(false))
      return
    }

    const checked: number[] = yield select(selectCartListCheckedLocalIds)
    const billableSet = new Set(billableIds)
    const allChecked = billableIds.every((id) => checked.includes(id))

    if (allChecked) {
      const next = checked.filter((id) => !billableSet.has(id))
      yield put(setCartListCheckedLocalIds(next))
      yield put(syncCartListCheckBoxToolbarIcon(false))
    } else {
      const next = [...new Set([...checked, ...billableIds])]
      yield put(setCartListCheckedLocalIds(next))
      yield put(syncCartListCheckBoxToolbarIcon(true))
    }
    return
  }

  if (key === 'listDelete') {
    if (cartListDeleteInFlight) return
    cartListDeleteInFlight = true
    try {
      const segment: ReturnType<typeof selectCartListStatusSegment> =
        yield select(selectCartListStatusSegment)
      if (segment !== 'cart') return

      const items: PostcardHydrated[] = yield select(selectCartItems)
      const checked: number[] = yield select(selectCartListCheckedLocalIds)
      const billable = new Set(cartListBillableLocalIds(items))
      const ids = checked.filter((id) => billable.has(id))
      if (ids.length === 0) return

      for (const localId of ids) {
        yield call(handleRemoveCartPostcard, removeCartPostcard(localId))
      }
    } finally {
      cartListDeleteInFlight = false
    }
  }
}

export function* watchCartToolbar(): SagaIterator {
  yield all([
    takeEvery(toolbarAction.type, handleCartToolbarAction),
    takeEvery(toolbarAction.type, handleCartListToolbarAction),
  ])
}
