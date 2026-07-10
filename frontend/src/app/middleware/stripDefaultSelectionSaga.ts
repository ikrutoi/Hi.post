import type { PayloadAction } from '@reduxjs/toolkit'
import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import { store } from '@app/state/store'
import {
  addItem,
  setCartListSelectedLocalId,
  setCartListStatusSegment,
} from '@cart/infrastructure/state'
import { selectCartItems, selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import {
  setHistoryListSelectedLocalId,
  setNotebookStripTab,
  updateLastViewedCalendarDate,
} from '@date/calendar/infrastructure/state'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import {
  calendarViewDateForPostcard,
  resolveDefaultCartStripPostcard,
  resolveDefaultHistoryStripPostcard,
  shouldApplyCartStripDefaultSelection,
  shouldApplyHistoryStripDefaultSelection,
  HISTORY_STRIP_STATUS_PRIORITY,
} from '@date/application/helpers/stripDefaultSelection'
import { cartListStatusSegmentForLocalId } from '@date/calendar/application/logic/cartStripDayPostcardSelection'
import { applyRightListArchiveToolbarVisuals } from '@toolbar/application/syncRightListArchiveToolbarVisuals'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatus } from '@entities/postcard/domain/types'

let lastNotebookStripTab: DateStripSection | null = null

export function* applyCartStripDefaultSelectionIfNeededSaga(): SagaIterator {
  const state: RootState = yield select()
  if (!shouldApplyCartStripDefaultSelection(state)) return

  const cartItems: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = resolveDefaultCartStripPostcard(cartItems)
  if (postcard == null) return

  yield put(setCartListSelectedLocalId(postcard.localId))
  yield put(updateLastViewedCalendarDate(calendarViewDateForPostcard(postcard)))
  yield call(
    applyRightListArchiveToolbarVisuals,
    store.dispatch,
    store.getState,
    'cart',
  )
}

export function* applyHistoryStripDefaultSelectionIfNeededSaga(): SagaIterator {
  const state: RootState = yield select()
  if (!shouldApplyHistoryStripDefaultSelection(state)) return

  const cartItems: PostcardHydrated[] = yield select(selectCartItems)
  const postcard = resolveDefaultHistoryStripPostcard(cartItems)

  yield put(setHistoryListSelectedLocalId(postcard?.localId ?? null))

  if (postcard == null) return

  yield put(updateLastViewedCalendarDate(calendarViewDateForPostcard(postcard)))
  yield call(
    applyRightListArchiveToolbarVisuals,
    store.dispatch,
    store.getState,
    'history',
  )
}

function* handleNotebookStripTabChanged(
  action: PayloadAction<DateStripSection>,
): SagaIterator {
  const nextTab = action.payload
  const enteredCartStrip =
    nextTab === 'cart' && lastNotebookStripTab !== 'cart'
  const enteredHistoryStrip =
    nextTab === 'history' && lastNotebookStripTab !== 'history'
  lastNotebookStripTab = nextTab

  if (enteredCartStrip) {
    yield* applyCartStripDefaultSelectionIfNeededSaga()
  }
  if (enteredHistoryStrip) {
    yield* applyHistoryStripDefaultSelectionIfNeededSaga()
  }
}

function* handleCartItemAdded(
  action: PayloadAction<PostcardHydrated>,
): SagaIterator {
  const item = action.payload
  const state: RootState = yield select()

  if (selectCartListPanelOpen(state)) {
    const cartItems: PostcardHydrated[] = yield select(selectCartItems)
    const segment = cartListStatusSegmentForLocalId(cartItems, item.localId)
    yield put(setCartListStatusSegment(segment))
    yield put(setCartListSelectedLocalId(item.localId))
    yield put(updateLastViewedCalendarDate(calendarViewDateForPostcard(item)))
    yield call(
      applyRightListArchiveToolbarVisuals,
      store.dispatch,
      store.getState,
      'cart',
    )
    return
  }

  if (!selectIsHistoryListPanelOpen(state)) return

  if (item.status === 'cartBlocked') return
  if (
    !(HISTORY_STRIP_STATUS_PRIORITY as readonly PostcardStatus[]).includes(
      item.status,
    )
  ) {
    return
  }

  yield put(setHistoryListSelectedLocalId(item.localId))
  yield put(updateLastViewedCalendarDate(calendarViewDateForPostcard(item)))
  yield call(
    applyRightListArchiveToolbarVisuals,
    store.dispatch,
    store.getState,
    'history',
  )
}

export function* watchStripDefaultSelection(): SagaIterator {
  yield takeEvery(setNotebookStripTab.type, handleNotebookStripTabChanged)
  yield takeEvery(addItem.type, handleCartItemAdded)
}
