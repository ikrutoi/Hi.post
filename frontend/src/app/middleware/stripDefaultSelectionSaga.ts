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
import {
  selectCartItems,
  selectCartListPanelOpen,
  selectCartListSelectedLocalId,
} from '@cart/infrastructure/selectors'
import {
  setHistoryListSelectedLocalId,
  setNotebookStripTab,
  updateLastViewedCalendarDate,
} from '@date/calendar/infrastructure/state'
import {
  selectHistoryListSelectedLocalId,
  selectIsHistoryListPanelOpen,
  selectRightListArchiveCardPieHighlightDispatchDate,
} from '@date/calendar/infrastructure/selectors'
import { archiveCalendarViewEntered } from '@date/calendar/application/orchestration/notebookOrchestration.events'
import { syncArchiveCenterPostcardCalendarView } from '@date/calendar/application/logic/archiveCenterCalendarSync'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import {
  calendarViewDateForPostcard,
  resolveDefaultCartStripPostcard,
  shouldApplyCartStripDefaultSelection,
  shouldApplyHistoryStripDefaultSelection,
  HISTORY_STRIP_STATUS_PRIORITY,
} from '@date/application/helpers/stripDefaultSelection'
import { resolveDefaultHistoryStripPostcard } from '@date/application/helpers/historyListPanelEntries'
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

  const postcard = resolveDefaultHistoryStripPostcard(state)

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

/** Вход в календарь корзины/истории: месяц = дата открытки в центральном CardPie
 * (основной месяц даты отправки, не соседний месяц сетки, где день виден в padding). */
function* handleArchiveCalendarViewEntered(
  action: PayloadAction<'cart' | 'history'>,
): SagaIterator {
  const source = action.payload
  const state: RootState = yield select()

  const highlightDate = selectRightListArchiveCardPieHighlightDispatchDate(state)
  if (highlightDate != null) {
    yield put(
      updateLastViewedCalendarDate({
        year: highlightDate.year,
        month: highlightDate.month,
      }),
    )
    return
  }

  const localId =
    source === 'cart'
      ? selectCartListSelectedLocalId(state)
      : selectHistoryListSelectedLocalId(state)
  if (localId == null) return

  syncArchiveCenterPostcardCalendarView(
    store.dispatch,
    store.getState,
    localId,
    { includeDayPanel: false },
  )
}

export function* watchStripDefaultSelection(): SagaIterator {
  yield takeEvery(setNotebookStripTab.type, handleNotebookStripTabChanged)
  yield takeEvery(addItem.type, handleCartItemAdded)
  yield takeEvery(
    archiveCalendarViewEntered.type,
    handleArchiveCalendarViewEntered,
  )
}
