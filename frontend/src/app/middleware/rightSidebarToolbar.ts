import { takeEvery, put, select, call } from 'redux-saga/effects'
import type { PayloadAction } from '@reduxjs/toolkit'
import { toolbarAction } from '@toolbar/application/helpers'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  setCartListPanelOpen,
  setCartListStatusSegment,
} from '@cart/infrastructure/state'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import {
  setCartCalendarDatePickMode,
  setHistoryListPanelOpen,
  setNotebookStripTab,
} from '@date/calendar/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { setUserLoginPanelOpen } from '@features/auth/infrastructure/state/auth.slice'
import {
  selectIsAuthenticated,
  selectUserLoginPanelOpen,
} from '@features/auth/infrastructure/selectors/authSelectors'
import {
  syncSectionMenuVisuals,
  syncSectionMenuVisualsAllEnabled,
} from './sectionEditorMenuHandlers'
import {
  RIGHT_SIDEBAR_KEYS,
  type RightSidebarKey,
} from '@/features/toolbar/domain/types/rightSidebar.types'

function* syncRightSidebarVisuals(clickedKey: RightSidebarKey) {
  const section = 'rightSidebar'
  for (const iconKey of RIGHT_SIDEBAR_KEYS) {
    yield put(
      updateToolbarIcon({
        section,
        key: iconKey,
        value: iconKey === clickedKey ? 'active' : 'enabled',
      }),
    )
  }

}

export function* handleRightSidebarToolbarAction(
  action: PayloadAction<{ section: string; key: RightSidebarKey }>,
) {
  const { section, key } = action.payload

  if (section !== 'rightSidebar') return

  if (key === 'userLogin') {
    const isOpen: boolean = yield select(selectUserLoginPanelOpen)
    const nextOpen = !isOpen
    yield put(setUserLoginPanelOpen(nextOpen))
    if (nextOpen) {
      yield put(setCartListPanelOpen(false))
      yield put(setHistoryListPanelOpen(false))
    }
    yield put(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'userLogin',
        value: nextOpen ? 'active' : 'enabled',
      }),
    )
    if (nextOpen) {
      for (const iconKey of RIGHT_SIDEBAR_KEYS) {
        if (iconKey === 'userLogin') continue
        yield put(
          updateToolbarIcon({
            section: 'rightSidebar',
            key: iconKey,
            value: 'enabled',
          }),
        )
      }
    }
    return
  }

  if (key === 'cart') {
    const isCartActive: boolean = yield select(selectCartListPanelOpen)
    const nextOpen = !isCartActive
    yield put(setCartListPanelOpen(nextOpen))
    if (nextOpen) {
      yield put(setHistoryListPanelOpen(false))
      yield put(setUserLoginPanelOpen(false))
      /** Полоса держится сагой синхронизации (`cart.isActive` → `cart`). */
      yield put(setCartCalendarDatePickMode(false))
      yield put(setCartListStatusSegment('cart'))
      yield put(setNotebookStripTab('cart'))
      yield put(setActiveSection('date'))
      /** `setActiveSection('date')` без смены Redux-секции не триггерит сагу — всё равно снимаем active с иконки «Дата» в меню. */
      yield call(syncSectionMenuVisualsAllEnabled)
    } else {
      const activeSection = yield select(selectActiveSection)
      if (activeSection != null) {
        yield call(syncSectionMenuVisuals, activeSection)
      }
    }
    yield put(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'cart',
        value: nextOpen ? 'active' : 'enabled',
      }),
    )
    if (nextOpen) {
      for (const iconKey of RIGHT_SIDEBAR_KEYS) {
        if (iconKey === 'cart') continue
        yield put(
          updateToolbarIcon({
            section: 'rightSidebar',
            key: iconKey,
            value: 'enabled',
          }),
        )
      }
    }
    return
  }

  yield* syncRightSidebarVisuals(key)

  if (key === 'history') {
    const isAuthenticated: boolean = yield select(selectIsAuthenticated)
    if (!isAuthenticated) {
      yield put(setUserLoginPanelOpen(true))
      yield put(setCartListPanelOpen(false))
      yield put(setHistoryListPanelOpen(false))
      yield put(
        updateToolbarIcon({
          section: 'rightSidebar',
          key: 'userLogin',
          value: 'active',
        }),
      )
      for (const iconKey of RIGHT_SIDEBAR_KEYS) {
        if (iconKey === 'userLogin') continue
        yield put(
          updateToolbarIcon({
            section: 'rightSidebar',
            key: iconKey,
            value: 'enabled',
          }),
        )
      }
      return
    }

    const cartListOpen: boolean = yield select(selectCartListPanelOpen)
    if (cartListOpen) {
      yield put(setCartListPanelOpen(false))
    }
    yield put(setUserLoginPanelOpen(false))
    yield put(setNotebookStripTab('history'))
    yield put(setHistoryListPanelOpen(true))
    yield put(setActiveSection('history'))
  }
}

export function* rightSidebarToolbarSaga() {
  yield takeEvery(toolbarAction.type, handleRightSidebarToolbarAction)
}
