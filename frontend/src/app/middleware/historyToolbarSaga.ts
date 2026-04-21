import { all, put, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  openDayPanel,
  setHistoryListPanelOpen,
  toggleDateListSortDirection,
  setPostcardStatuses,
} from '@date/calendar/infrastructure/state'
import {
  selectIsHistoryListPanelOpen,
  selectPostcardStatuses,
} from '@date/calendar/infrastructure/selectors'
import { PostcardStatuses } from '@/entities/postcard/domain/types'

function* handleHistoryListToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'history' || key !== 'listHistory') return

  // if (key === 'sortDown') {
  //   yield put(toggleDateListSortDirection())
  //   return
  // }

  // if (key === 'listDelete') {
  //   return
  // }
}

function* handleHistoryToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'history' || key !== 'listHistory') return

  const listOpen: boolean = yield select(selectIsHistoryListPanelOpen)
  const nextOpen = !listOpen

  yield put(setHistoryListPanelOpen(nextOpen))
  yield put(
    updateToolbarIcon({
      section: 'history',
      key: 'listHistory',
      value: nextOpen ? 'active' : 'enabled',
    }),
  )
}

function* syncListHistoryIconOnDayPanelOpen(): SagaIterator {
  yield put(
    updateToolbarIcon({
      section: 'history',
      key: 'listHistory',
      value: 'enabled',
    }),
  )
}

// function* syncPostcardStatuses(
//   action: ReturnType<typeof setPostcardStatuses>,
// ): SagaIterator {
//   console.log('syncPostcardStatuses', action.payload)
//   // yield put(setPostcardStatuses(action.payload))
// }

export function* watchHistoryToolbar(): SagaIterator {
  yield all([
    takeEvery(toolbarAction.type, handleHistoryToolbarAction),
    takeEvery(toolbarAction.type, handleHistoryListToolbarAction),
    // takeEvery(openDayPanel.type, syncListDateIconOnDayPanelOpen),
    // takeEvery(setPostcardStatuses.type, syncPostcardStatuses),
  ])
}
