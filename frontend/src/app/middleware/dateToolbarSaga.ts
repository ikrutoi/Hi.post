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
  toggleCardPieListSortDirection,
  setPostcardStatuses,
} from '@date/calendar/infrastructure/state'
import {
  // selectIsHistoryListPanelOpen,
  selectIsDateListPanelOpen,
  selectPostcardStatuses,
} from '@date/calendar/infrastructure/selectors'
import { PostcardStatuses } from '@/entities/postcard/domain/types'

function* handleDateListToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  // console.log('handleDateListToolbarAction', section, key)
  if (section !== 'date') return

  if (key === 'listDate') {
    yield put(toggleDateListSortDirection())
    return
  }

  if (key === 'listDelete') {
    return
  }
}

function* handleDateToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'date') return

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

function* handleCardPieListToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'cardPieList') return
  if (key === 'sortDown') {
    yield put(toggleCardPieListSortDirection())
  }
}

function* syncListIconsWhenOpeningExclusiveList(
  action: PayloadAction<boolean>,
): SagaIterator {
  if (action.type === setDateListPanelOpen.type && action.payload) {
    yield put(
      updateToolbarIcon({
        section: 'editorPie',
        key: 'listCardPie',
        value: 'enabled',
      }),
    )
  }
  if (action.type === setCardPieListPanelOpen.type && action.payload) {
    yield put(
      updateToolbarIcon({
        section: 'date',
        key: 'listDate',
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
    takeEvery(toolbarAction.type, handleCardPieListToolbarAction),
    takeEvery(setDateListPanelOpen.type, syncListIconsWhenOpeningExclusiveList),
    takeEvery(setCardPieListPanelOpen.type, syncListIconsWhenOpeningExclusiveList),
    takeEvery(openDayPanel.type, syncListDateIconOnDayPanelOpen),
    // takeEvery(setPostcardStatuses.type, syncPostcardStatuses),
  ])
}
