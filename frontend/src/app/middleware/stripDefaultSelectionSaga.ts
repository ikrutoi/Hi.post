import type { PayloadAction } from '@reduxjs/toolkit'
import type { SagaIterator } from 'redux-saga'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import type { RootState } from '@app/state'
import { store } from '@app/state/store'
import { setCartListSelectedLocalId } from '@cart/infrastructure/state'
import { selectCartItems } from '@cart/infrastructure/selectors'
import {
  setHistoryListSelectedLocalId,
  setNotebookStripTab,
  updateLastViewedCalendarDate,
} from '@date/calendar/infrastructure/state'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import {
  calendarViewDateForPostcard,
  resolveDefaultCartStripPostcard,
  resolveDefaultHistoryStripPostcard,
  shouldApplyCartStripDefaultSelection,
  shouldApplyHistoryStripDefaultSelection,
} from '@date/application/helpers/stripDefaultSelection'
import { applyRightListArchiveToolbarVisuals } from '@toolbar/application/syncRightListArchiveToolbarVisuals'
import type { PostcardHydrated } from '@entities/postcard'

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

export function* watchStripDefaultSelection(): SagaIterator {
  yield takeEvery(setNotebookStripTab.type, handleNotebookStripTabChanged)
}
