import { all, put, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import type { PostcardHydrated } from '@entities/postcard'
import { cartListBillableLocalIds } from '@cart/application/logic/cartListBillableLocalIds'
import {
  selectCartItems,
  selectCartListCheckedLocalIds,
  selectCartListPanelOpen,
} from '@cart/infrastructure/selectors'
import {
  setCartListCheckedLocalIds,
  setCartListPanelOpen,
} from '@cart/infrastructure/state'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'

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
}

export function* watchCartToolbar(): SagaIterator {
  yield all([
    takeEvery(toolbarAction.type, handleCartToolbarAction),
    takeEvery(toolbarAction.type, handleCartListToolbarAction),
  ])
}
