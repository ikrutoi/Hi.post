import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects'
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
  cycleHistoryListPanelDensity,
  setHistoryListPanelDensity,
  setPostcardStatuses,
} from '@date/calendar/infrastructure/state'
import {
  // selectIsHistoryListPanelOpen,
  selectHistoryListPanelDensity,
  selectIsDateListPanelOpen,
  selectIsCardPieListPanelOpen,
  selectPostcardStatuses,
} from '@date/calendar/infrastructure/selectors'
import { PostcardStatuses } from '@/entities/postcard/domain/types'
import { storeAdapters } from '@db/adapters/storeAdapters'
import type { UiPreferencesRecord } from '@db/types/storeMap.types'

const HISTORY_LIST_UI_PREF_ID = 'historyList' as const

function* hydrateHistoryListPanelDensityFromDbSaga(): SagaIterator {
  try {
    const pref: UiPreferencesRecord | null = yield call(
      [storeAdapters.uiPreferences, 'getById'] as const,
      HISTORY_LIST_UI_PREF_ID,
    )
    if (pref?.id !== 'historyList') return
    const d = pref.historyListPanelDensity
    if (d === 1 || d === 2 || d === 3) {
      yield put(setHistoryListPanelDensity(d))
    }
  } catch (e) {
    console.error('hydrateHistoryListPanelDensityFromDbSaga', e)
  }
}

function* persistHistoryListPanelDensityToDbSaga(): SagaIterator {
  try {
    const d: 1 | 2 | 3 = yield select(selectHistoryListPanelDensity)
    const payload = {
      id: HISTORY_LIST_UI_PREF_ID,
      historyListPanelDensity: d,
    } as const satisfies UiPreferencesRecord
    yield call([storeAdapters.uiPreferences, 'put'] as const, payload)
  } catch (e) {
    console.error('persistHistoryListPanelDensityToDbSaga', e)
  }
}

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

  if (section === 'historyList' && key === 'historyPanelDensity') {
    yield put(cycleHistoryListPanelDensity())
    yield call(persistHistoryListPanelDensityToDbSaga)
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
    fork(hydrateHistoryListPanelDensityFromDbSaga),
    takeEvery(toolbarAction.type, handleDateToolbarAction),
    takeEvery(toolbarAction.type, handleDateListToolbarAction),
    takeEvery(setDateListPanelOpen.type, syncListIconsWhenOpeningExclusiveList),
    takeEvery(setCardPieListPanelOpen.type, syncListIconsWhenOpeningExclusiveList),
    takeEvery(openDayPanel.type, syncListDateIconOnDayPanelOpen),
    // takeEvery(setPostcardStatuses.type, syncPostcardStatuses),
  ])
}
