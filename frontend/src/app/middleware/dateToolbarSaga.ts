import { all, put, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  openDayPanel,
  // setHistoryListPanelOpen,
  setDateListPanelOpen,
  setCardPieListPanelOpen,
  toggleDateListSortDirection,
  toggleHistoryListSortDirection,
  setPostcardStatuses,
} from '@date/calendar/infrastructure/state'
import {
  // selectIsHistoryListPanelOpen,
  selectIsDateListPanelOpen,
  selectIsCardPieListPanelOpen,
  selectPostcardStatuses,
} from '@date/calendar/infrastructure/selectors'
import { PostcardStatuses } from '@/entities/postcard/domain/types'

function* handleDateListToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload

  if (section === 'dateList' && key === 'sortDown') {
    yield put(toggleDateListSortDirection())
    return
  }

  if (section === 'historyList' && key === 'sortDown') {
    yield put(toggleHistoryListSortDirection())
    return
  }

  if (section !== 'date') return

  if (key === 'listDelete') {
    return
  }
}

function* handleDateToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'date') return
  if (key === 'listDate') {
    const listOpen: boolean = yield select(selectIsDateListPanelOpen)
    const nextOpen = !listOpen

    yield put(setDateListPanelOpen(nextOpen))
    yield put(
      updateToolbarIcon({
        section: 'date',
        key: 'listDate',
        value: nextOpen ? 'active' : 'enabled',
      }),
    )
    return
  }

  if (key === 'cardPie') {
    const listOpen: boolean = yield select(selectIsCardPieListPanelOpen)
    const nextOpen = !listOpen

    yield put(setCardPieListPanelOpen(nextOpen))
    yield put(
      updateToolbarIcon({
        section: 'date',
        key: 'cardPie',
        value: nextOpen ? 'active' : 'enabled',
      }),
    )
    yield put(
      updateToolbarIcon({
        section: 'editorPie',
        key: 'cardPie',
        value: nextOpen ? 'active' : 'enabled',
      }),
    )
  }
}

function* syncListDateIconOnDayPanelOpen(): SagaIterator {
  const listOpen: boolean = yield select(selectIsDateListPanelOpen)
  yield put(
    updateToolbarIcon({
      section: 'date',
      key: 'listDate',
      value: listOpen ? 'active' : 'enabled',
    }),
  )
}

function* syncListIconsWhenOpeningExclusiveList(
  action: PayloadAction<boolean>,
): SagaIterator {
  if (action.type === setDateListPanelOpen.type && action.payload) {
    yield put(
      updateToolbarIcon({
        section: 'editorPie',
        key: 'cardPie',
        value: 'enabled',
      }),
    )
  }
}

// function* syncPostcardStatuses(
//   action: ReturnType<typeof setPostcardStatuses>,
// ): SagaIterator {
//   console.log('syncPostcardStatuses', action.payload)
//   // yield put(setPostcardStatuses(action.payload))
// }

export function* watchDateToolbar(): SagaIterator {
  yield all([
    takeEvery(toolbarAction.type, handleDateToolbarAction),
    takeEvery(toolbarAction.type, handleDateListToolbarAction),
    takeEvery(setDateListPanelOpen.type, syncListIconsWhenOpeningExclusiveList),
    takeEvery(setCardPieListPanelOpen.type, syncListIconsWhenOpeningExclusiveList),
    takeEvery(openDayPanel.type, syncListDateIconOnDayPanelOpen),
    // takeEvery(setPostcardStatuses.type, syncPostcardStatuses),
  ])
}
