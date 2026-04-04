import { all, put, select, takeEvery } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { toolbarAction } from '@toolbar/application/helpers'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import {
  openDayPanel,
  setDateListPanelOpen,
  toggleDateListSortDirection,
} from '@date/calendar/infrastructure/state'
import { selectIsDateListPanelOpen } from '@date/calendar/infrastructure/selectors'

function* handleDateListToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'dateList') return

  if (key === 'sortDown') {
    yield put(toggleDateListSortDirection())
    return
  }

  if (key === 'listDelete') {
    // Заглушка: очистка списка дат — позже (история / корзина).
    return
  }
}

function* handleDateToolbarAction(
  action: ReturnType<typeof toolbarAction>,
): SagaIterator {
  const { section, key } = action.payload
  if (section !== 'date' || key !== 'listDate') return

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

/** При открытии панели дня сбрасываем состояние кнопки listDate (панель списка уже закрыта редьюсером). */
function* syncListDateIconOnDayPanelOpen(): SagaIterator {
  yield put(
    updateToolbarIcon({
      section: 'date',
      key: 'listDate',
      value: 'enabled',
    }),
  )
}

export function* watchDateToolbar(): SagaIterator {
  yield all([
    takeEvery(toolbarAction.type, handleDateToolbarAction),
    takeEvery(toolbarAction.type, handleDateListToolbarAction),
    takeEvery(openDayPanel.type, syncListDateIconOnDayPanelOpen),
  ])
}
