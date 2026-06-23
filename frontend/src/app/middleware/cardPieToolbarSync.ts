import type { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { setCardPieListPanelOpen } from '@date/calendar/infrastructure/state'
import { selectIsCardPieListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { CARD_PIE_TOOLBAR_SECTIONS } from '@toolbar/application/syncCardPieToolbarIcons'
import type { IconState } from '@shared/config/constants'

export function* setCardPieToolbarActiveState(active: boolean): SagaIterator {
  const value: IconState = active ? 'active' : 'enabled'
  for (const section of CARD_PIE_TOOLBAR_SECTIONS) {
    yield put(
      updateToolbarIcon({
        section,
        key: 'cardPie',
        value,
      }),
    )
  }
}

export function* syncCardPieToolbarActiveStateFromStore(): SagaIterator {
  const listOpen: boolean = yield select(selectIsCardPieListPanelOpen)
  yield call(setCardPieToolbarActiveState, listOpen)
}

export function* toggleCardPieListPanelFromToolbar(): SagaIterator {
  const listOpen: boolean = yield select(selectIsCardPieListPanelOpen)
  const nextOpen = !listOpen
  yield put(setCardPieListPanelOpen(nextOpen))
  yield call(setCardPieToolbarActiveState, nextOpen)
}
